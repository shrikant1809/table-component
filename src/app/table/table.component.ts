// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-table',
//   templateUrl: './table.component.html',
//   styleUrls: ['./table.component.css']
// })
// export class TableComponent {

// }
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  users!: Observable<User[]>;
  displayedUsers: User[];
  selectedRows: Set<string> = new Set<string>();
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private http: HttpClient) {
    this.displayedUsers = [];
  }

  ngOnInit(): void {
    this.users! = this.http
      .get<User[]>(
        'https://excelerate-profile-dev.s3.ap-south-1.amazonaws.com/1681980949109_users.json'
      )
      .pipe(
        map((users) => users.sort((a, b) => parseInt(a.id) - parseInt(b.id)))
      );

    this.users!.subscribe(
      (users) => (this.displayedUsers = users.slice(0, this.itemsPerPage))
    );
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedUsers = this.filterUsers().slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  filterUsers(): User[] {
    const users: User[] = [];
    this.users!.subscribe((data) => users.push(...data));

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }
  getPaginationArray(): number[] {
    const totalPages = Math.ceil(this.filterUsers().length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value; // 'value' should now be accessible without TS error
    // Your logic to handle the search change goes here
  }

  toggleSelectAll(): void {
    if (this.selectedRows.size === this.displayedUsers.length) {
      this.selectedRows.clear();
    } else {
      this.displayedUsers.forEach((user) => this.selectedRows.add(user.id));
    }
  }

  isRowSelected(id: string): boolean {
    return this.selectedRows.has(id);
  }

  toggleSelectRow(id: string): void {
    if (this.selectedRows.has(id)) {
      this.selectedRows.delete(id);
    } else {
      this.selectedRows.add(id);
    }
  }

  deleteSelectedRows(): void {
    const users: User[] = [];
    this.users!.subscribe((data) => users.push(...data));

    const filteredUsers = users.filter(
      (user) => !this.selectedRows.has(user.id)
    );
    this.users! = new Observable<User[]>((subscriber) =>
      subscriber.next(filteredUsers)
    );
    this.selectedRows.clear();
    this.updatePagination();
  }
}
