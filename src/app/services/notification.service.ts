import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) {
    this.toastr.toastrConfig.positionClass = 'toast-top-center';
    this.toastr.toastrConfig.preventDuplicates = true;
    this.toastr.toastrConfig.timeOut = 2000;
   }


  showSuccess(message: any): void {
      this.toastr.success(message);
  }

  showError(message: string): void {
      this.toastr.error(message);
  }

  showInfo(message: any): void {
      this.toastr.info(message);
  }

  showWarning(message: any): void {
      this.toastr.warning(message);
  }
}
