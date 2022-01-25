import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminRestService } from 'src/app/services/admin/admin.rest.service';

@Component({
  selector: 'app-admin-pending-promoters',
  templateUrl: './admin-pending-promoters.component.html',
  styleUrls: ['./admin-pending-promoters.component.css']
})

export class AdminPendingPromotersComponent implements OnInit {

  promoters: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private adminRestService: AdminRestService) {
  }


  ngOnInit(): void {
    this.getInactivePromoters();

  }


  acceptPromoter(id: string): void {
    this.adminRestService.acceptPromoter(id, 'active').subscribe((promoter: any) => {
      var indexPromoter = this.promoters.map((promoter) => promoter._id).indexOf(id);
      this.promoters.splice(indexPromoter, 1);
    })
  }

  rejectPromoter(id: string): void {
    this.adminRestService.acceptPromoter(id, 'rejected').subscribe((promoter: any) => {
      var indexPromoter = this.promoters.map((promoter) => promoter._id).indexOf(id);
      this.promoters.splice(indexPromoter, 1);
    })
  }


  getInactivePromoters(): void {
    this.adminRestService.getPromotersByStatus('inactive').subscribe((promoters: any[]) => {
      this.promoters = promoters;
    })
  }
}
