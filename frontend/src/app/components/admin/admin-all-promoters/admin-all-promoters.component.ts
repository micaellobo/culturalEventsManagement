import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminRestService } from 'src/app/services/admin/admin.rest.service';

@Component({
  selector: 'app-admin-all-promoters',
  templateUrl: './admin-all-promoters.component.html',
  styleUrls: ['./admin-all-promoters.component.css']
})

export class AdminAllPromotersComponent implements OnInit {

  promoters: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private adminRestService: AdminRestService) {
  }

  ngOnInit(): void {
    this.getActivePromoters();
  }

  getActivePromoters(): void {
    this.adminRestService.getPromotersByStatus('active').subscribe((promoters: any[]) => {
      this.promoters = promoters;
    })
  }

  rejectPromoter(id: string): void {
    this.adminRestService.acceptPromoter(id, 'rejected').subscribe((promoter: any) => {
      var indexPromoter = this.promoters.map((promoter) => promoter._id).indexOf(id);
      this.promoters.splice(indexPromoter, 1);
    })
  }

}
