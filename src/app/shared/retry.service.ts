import { Injectable } from '@angular/core';

@Injectable()
export class RetryService {
  constructor() { }

  private retryResrc;
  private retryInterval = 1000;

  public abortRetry(): void{
     clearInterval(this.retryResrc);
  }

  public retry (methodToRetry : any) : void {
    // Clear if any previous interval this runing
    clearInterval(this.retryResrc);
    // Start new interval
    this.retryResrc = setInterval(function () {  
      methodToRetry();
    }, this.retryInterval);
  }
}

