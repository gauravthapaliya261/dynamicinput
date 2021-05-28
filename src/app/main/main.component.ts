import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  inputTypes = [
    {
      label: 'Text',
      name: 'text'
    },
    {
      label: 'Textarea',
      name: 'textarea'
    },
    {
      label: 'Checkbox',
      name: 'checkbox'
    },
    {
      label: 'Radio Button',
      name: 'radio'
    },
    {
      label: 'Select Dropdown',
      name: 'select'
    },
    {
      label: 'Toggle Switch',
      name: 'toggle'
    },
    {
      label: 'Date',
      name: 'date'
    },
    {
      label: 'Time',
      name: 'time'
    },
    {
      label: 'DateTime',
      name: 'datetime'
    },
  ];

  listItems = [];
  outputArray = [];
  formBasic: FormGroup;
  addNewForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.buildAddNewForm();
  }

  buildForm(): void {
    this.formBasic = this.fb.group({}, { updateOn: 'change' });
    for (const i of this.listItems) {
      this.formBasic.addControl(i.label, this.fb.control(''));
    }
  }

  buildAddNewForm(): void {
    this.addNewForm = this.fb.group({
      type: ['', Validators.required],
      label: ['', Validators.required],
      placeholder: [''],
      options: [''],
      isRequired: [true]
    });
  }

  get type(): AbstractControl {
    return this.addNewForm.get('type');
  }
  get label(): AbstractControl {
    return this.addNewForm.get('label');
  }
  get options(): AbstractControl {
    return this.addNewForm.get('options');
  }

  addNew(): void {
    if (this.formBasic.contains(this.addNewForm.value.label)) {
      this.toastr.warning('Input field with label ' + this.addNewForm.value.label + ' already added.', 'Oops !', { timeOut: 3000 });
    } else {
      this.listItems.push(this.addNewForm.value);
      if (this.addNewForm.value.type === 'checkbox' || this.addNewForm.value.type === 'toggle') {
        this.formBasic.addControl(this.addNewForm.value.label,
          this.fb.control(false, this.addNewForm.value.isRequired ? Validators.required : null));
      } else {
        this.formBasic.addControl(this.addNewForm.value.label,
          this.fb.control('', this.addNewForm.value.isRequired ? Validators.required : null));
      }
    }
    this.addNewForm.reset();
    this.addNewForm.controls.isRequired.setValue(true);
    this.addNewForm.controls.type.setValue('');
  }

  changeType(event): void {
    if (event.target.value === 'radio' || event.target.value === 'select') {
      this.options.setValidators([Validators.required]);
    } else {
      this.options.clearValidators();
    }
    this.options.updateValueAndValidity();
  }

  deleteField(item): void {
    const index = this.listItems.indexOf(item);
    this.listItems.splice(index, 1);
    this.formBasic.removeControl(item.label);
    this.toastr.info('Item deleted successfully', 'Success !', { timeOut: 3000 });
    this.submit();
  }

  clearAll(): void {
    this.listItems = [];
    this.formBasic = this.fb.group([]);
    this.submit();
    this.toastr.success('All items cleared.', 'Success !', { timeOut: 3000 });
  }
  submit(): void {
    this.outputArray = [];
    // tslint:disable-next-line: forin
    for (const element in this.formBasic.value) {
      this.outputArray.push({
        name: element,
        value: this.formBasic.value[element]
      });
    }
  }
}
