import { LightningElement, track } from 'lwc';
import findContacts from "@salesforce/apex/Key_Account_opp_billing_controller.getKeyAccountBillDetails";

export default class GlassIcon_MVP_Monthly_Sales extends LightningElement {
    loaded = false;
    value = [];
    @track fromdate;
    @track todate;
    @track AccStage;
    @track Platinum = false;
    arrayaccStage = [];
    @track checkvalue = false;
    @track errorMSg;
    @track Inspire = false;
    @track tableData = [];
    pageSizeOptions = [5, 10, 25, 50, 75, 100]; //Page size options
    records = []; //All records available in the data table
    columns = ['REGION', 'SALES AREA', 'ACCOUNT NAME', 'OPPORTUNITY', 'PROJECT CODE', 'APPROPRIATED QUANTITY']; //columns information available in the data table
    @track total = 0; //Total no.of records
    totalRecords
    pageSize = 500; //No.of records to be displayed per page
    totalPages; //Total no.of pages
    pageNumber = 1; //Page number    
    @ track recordsToDisplay = []; //Records to be displayed on the page
    displayrec = [];
    

    get Accountoptions() {
        return [
            { label: 'Fabricator', value: 'Fabricator' },
            { label: 'Window Maker', value: 'Window Maker' },
        ];
    }

    get platinumoptions() {
        return [
            { label: 'Fabricator', value: 'Fabricator' },
            { label: 'Window Maker', value: 'Window Maker' },
        ];
    }

    get selectedValues() {
        return this.value.join(',');
    }

    handleChange(e) {
        this.value = e.detail.value;
    }

    fromDateChange(event){
        this.fromdate = event.target.value;
        console.log('From Date++++++++++++++++++++'+ this.fromdate)
        //alert('From Date++++++++++++++++++++'+ this.fromdate)
    }
    toDateChange(event){
        this.todate = event.target.value;
        console.log('To Date+++++++++++++++++++++++'+ this.todate)
        //alert('To Date+++++++++++++++++++++++'+ this.todate)
    }

    AccounthandleChange(event){
        this.AccStage = event.target.value;
        this.arrayaccStage = [...this.arrayaccStage, this.AccStage];
        console.log('Opportunity stage========================+'+ this.AccStage)
        //alert('Opportunity stage========================+'+ this.AccStage)
        console.log('Arrray Opportunity stage========================+'+ this.arrayaccStage)
        //alert('Opportunity stage========================+'+ this.arrayaccStage)
    }

    PlatinumCustomerhandler(event){
        console.log('Before Assignment>>>>>>>>>>>>>>'+ JSON.stringify(this.Platinum))
        if(this.Platinum == true){
        this.Platinum = false;
        }
        else{
            this.Platinum = true;
        }
        //alert(JSON.stringify(this.Platinum))
        console.log('After Assignment>>>>>>>>>>'+ JSON.stringify(this.Platinum))
        

    }

    handleClicksubmit(event) {

        this.loaded = true;
        if((this.fromdate == null || this.fromdate == undefined) & (this.todate == null || this.todate == undefined) & (this.AccStage == null || this.AccStage == undefined)){
            this.errorMSg = 'Please select required field fromDate, ToDate and AccountName';
        }
        else if(this.fromdate == null & this.todate != null){
            this.errorMsg = 'Please fill the both dates';
            //this.loaded = false;
           // this.Gdata = false;
        }else if(this.fromdate != null & this.todate == null){
            this.errorMsg = 'Please fill the both dates';
           // this.loaded = false;
           // this.Gdata = false;

        }
        else{

            //alert('enter into submit button'+  JSON.stringify(this.AccStage));
           // alert('enter into submit button'+  JSON.stringify(this.fromdate));
            //alert('enter into submit button'+  JSON.stringify(this.todate));
            //alert('enter into submit button'+  JSON.stringify(this.Platinum));

            findContacts({ fDate: this.fromdate, tDate: this.todate, accountStage: this.AccStage, cbox: this.Platinum})
      .then((result) => {
        //alert('return List from Apex>>>>>>>>>>>>>>>>'+ JSON.stringify(result))
        //this.tableData = result;
        this.loaded = false;
        this.Inspire = true;
        this.total = result.length;
        this.totalRecords = result.length;
        //alert('totalrecords&&&&&&&&'+ this.totalRecords) ;
        this.displayrec = result;
        this.paginationHelper();
        return this.displayrec;
        /*this.contacts = result;
        this.error = undefined;*/
      })
      .catch((error) => {
        this.loaded = false;
        //alert('return List from Apex>>>>>>>>>>>>>>>>'+ JSON.stringify(error))
        this.errorMSg = error
        /*this.error = error;
        this.contacts = undefined;*/
      });
        }

    }

    previousPage() {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>previousPage');
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>nextPage');
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }
    // JS function to handel pagination logic 
    paginationHelper() {
        this.recordsToDisplay = [];
        console.log('recordsToDisplay+++++++++++++++++++++++++'+ this.recordsToDisplay);
        //alert('recordsToDisplay+++++++++++++++++++++++++'+ this.recordsToDisplay)
        // calculate total pages
        console.log('calculate the total pages check the TOTAL Records'+ this.totalRecords);
        //alert('calculate the total pages check the TOTAL Records'+ this.totalRecords)
        console.log('calculate the total pages check the PAGE SIZE>>>>>'+ this.pageSize);
        //alert('calculate the total pages check the PAGE SIZE'+ this.pageSize)
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        console.log('totalPages==========================='+ this.totalPages);
        //alert('totalPages==========================='+ this.totalPages);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.displayrec[i]);
            //alert('records to display=========================='+ JSON.stringify(this.recordsToDisplay))
            console.log('length of record to display================================='+ this.recordsToDisplay.length);
            console.log('records to display=========================='+ JSON.stringify(this.recordsToDisplay));
        }
    }
     

    exportContactData(){
        if(this.displayrec.length > 0){
        //alert('length>>>>>>>>>>>>>>>'+ this.displayrec.length)

        // Prepare a html table
        let doc = '<table>';
        // Add styles for the table
        doc += '<style>';
        doc += 'table, th, td {';
        doc += '    border: 1px solid black;';
        doc += '    border-collapse: collapse;';
        doc += '}';          
        doc += '</style>';
        // Add all the Table Headers

        doc += '<tr>';

        doc += '<th>'+ 'Region' +'</th>';
        doc += '<th>'+ 'Sales Area' +'</th>';
        doc += '<th>'+ 'Account' +'</th>';
        doc += '<th>'+ 'opportunity' +'</th>';
        doc += '<th>'+ 'Project Code' +'</th>';
        doc += '<th>'+ 'APPROPRIATED QUANTITY' +'</th>';

        doc += '</tr>';

        // Add the data rows
        this.displayrec.forEach(record => {
            doc += '<tr>';
            doc += '<th>'+record.Region+'</th>'; 
            doc += '<th>'+record.SalesArea+'</th>'; 
            doc += '<th>'+record.KeyAccount+'</th>';
            doc += '<th>'+record.OpportunityName+'</th>';
            doc += '<th>'+record.ProjectCode+'</th>';
            doc += '<th>'+record.Qty+'</th>'; 
            doc += '</tr>';
        });
        doc += '</table>';
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        downloadElement.download = 'Key Account Billings.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click();
    }
    else{

        this.errorMsg = 'No records so, Excel not allowed to Download';

    }
    }

}
