// src/app/user.service.ts

import { Injectable } from '@angular/core';
import { User, MOCK_USERS } from './mock-data'; // Make sure the import path is correct

@Injectable({
  providedIn: 'root',
})
export class UserService {
  getUsers(): User[] {
    return MOCK_USERS;
  }

  getUserById(id: string): User | undefined {
    return MOCK_USERS.find((user) => user.id === id);
  }

  // Add more methods to manipulate the data as needed
}
