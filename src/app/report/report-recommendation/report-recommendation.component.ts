import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ErrorService } from 'src/app/error/error.service';
import { ReportRecommendationFilter, ReportService } from '../report.service';
import * as FileSaver from 'file-saver';

import jsPDF from 'jspdf'
import 'jspdf-autotable'

@Component({
  selector: 'app-report-recommendation',
  templateUrl: './report-recommendation.component.html',
  styleUrls: ['./report-recommendation.component.scss']
})
export class ReportRecommendationComponent implements OnInit {
  loading: boolean = false;
  loadingFilter: boolean = false;

  filter = new ReportRecommendationFilter();
  totalRecords: number = 0;
  reports = [];

  cols = ['Code', 'Name', 'Dt. Env. Rel.', 'Total Rec.'];
  headers = this.createHeaders(this.cols);

  constructor(
    private reportService: ReportService,
    private errorService: ErrorService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
  }

  createHeaders(keys) {
    var result = [];
    for (var i = 0; i < keys.length; i += 1) {
      result.push({
        'id': keys[i],
        'name': keys[i],
        'prompt': keys[i],
        'width': 65,
        'align': 'center',
        'padding': 0
      });
    }
    return result;
  }

  read(page = 0): void {
    this.filter.page = page;
    this.reportService.read(this.filter)
      .then((result) => {
        this.reports = result.content;
        this.totalRecords = result.totalElements;
      })
      .catch((error) => this.errorService.handle(error))
      .finally(() => this.loading = false);
  }

  lazyLoad(event: LazyLoadEvent) {
    const page = event.first / event.rows;
    this.filter.rows = event.rows;
    this.read(page);
  }

  clearFilter(form: NgForm) {
    form.reset();
  }

  exportPdf() {
    // var doc = new jsPDF('p', 'pt');
    // doc.table(1, 1, this.reports, this.headers, { autoSize: true });
    // doc.save('reports.pdf');

    // import("jspdf").then(jsPDF => {
    //   import("jspdf-autotable").then(() => {
    //     const doc = new jsPDF.default('p', 'in', [0, 0]);
    //     doc.autoTable(this.exportColumns, this.reports);
    //     doc.save('reports.pdf');
    //   })
    // })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.reports);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "reports");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
