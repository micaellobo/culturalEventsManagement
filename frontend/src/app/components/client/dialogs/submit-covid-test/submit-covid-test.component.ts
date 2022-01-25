import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientRestService } from 'src/app/services/client/client.rest.service';

@Component({
  selector: 'app-submit-covid-test',
  templateUrl: './submit-covid-test.component.html',
  styleUrls: ['./submit-covid-test.component.css']
})
export class SubmitCovidTestComponent implements OnInit {

  fileGroup: FormGroup;
  hasError: boolean = false;

  constructor(private clientRestService: ClientRestService, private dialogRef: MatDialogRef<SubmitCovidTestComponent>) {
    this.fileGroup = new FormGroup({ file: new FormControl('', Validators.required) })
  }

  ngOnInit(): void {
  }

  submittCovidTest(): void {

    let file: File = new File([''], '');

    try {
      file = this.fileGroup.controls['file'].value.files[0];
    } catch (error) { }

    if (!(this.fileGroup.hasError('required', 'file'))) {
      this.clientRestService.submitCovidTest(file).subscribe((client) => { })
      this.dialogRef.close(true);
    } else {
      this.hasError = true;
    }

  }

}
