import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveUserInformation from '@salesforce/apex/SearchController.saveUserInformation'; 

export default class SearchControl extends LightningElement {
    showBtnSubmit = true;   
    searchValue;
    dateOfBirth;  
    gender;
    saCitizen;
    year;
    code;
    showData;

    // check is input a number?
     isNumber = (search) => {
        if(isNaN(search)){
            return 'Please use digits!';
        }
     }

    // check valid ID
    validateId = (search) => {
        const rsaIdRegex = /^(?:\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01]))\d{4}[0-1]\d{1}\d{1}$/;
        if(!rsaIdRegex.test(search)){
            return 'Please enter a valid RSA ID!';
        }
    }

    toastErrorEvent = (message) => {
        const evt = new ShowToastEvent({
            title : "Attention",
            message : message,
            variant : "error"
        });
        this.dispatchEvent(evt);
    }

    checkSearchInput(e){
        const searchKey = e.target.value;

        if(e.key === 'Enter' || e.KeyCode === 13) {
            if(this.isNumber(searchKey)){
                this.toastErrorEvent(this.isNumber(searchKey));
            } else if(this.validateId(searchKey)){
                this.toastErrorEvent(this.validateId(searchKey));
            } else{                
                const evt = new ShowToastEvent({
                    title : "Great",
                    message : "Click the button to see the public holiday!",
                    variant : "success"
                });
                this.dispatchEvent(evt);

                this.searchValue = searchKey;
                this.showBtnSubmit = false;                
                this.dateOfBirth = searchKey.substring(0, 6); 
                this.gender = searchKey.substring(6, 10);
                this.saCitizen = searchKey.substring(10, 11);             
                
                
                if(this.dateOfBirth.substring(0, 1) >= 0 && this.dateOfBirth.substring(0, 1) <= 2 
                    && this.dateOfBirth.substring(1, 2) >= 0 && this.dateOfBirth.substring(1, 2) <= 9 ){
                    this.dateOfBirth = this.dateOfBirth.substring(2, 4) + "/" + this.dateOfBirth.substring(4, 6) + "/" 
                    + "20" + this.dateOfBirth.substring(0, 2);
                } else{
                    this.dateOfBirth = this.dateOfBirth.substring(2, 4) + "/" + this.dateOfBirth.substring(4, 6) + "/" 
                    + "19" + this.dateOfBirth.substring(0, 2);
                }
                if(this.gender >= 0 && this.gender <= 4999){
                    this.gender = "Female";
                } else if(this.gender >= 5000 && this.gender <= 9999){
                    this.gender = "Male";
                }
                if(this.saCitizen == 0){
                    this.saCitizen = true;
                } else {
                    this.saCitizen = false;
                }
            }
        }        
    }

    handleSubmit(){         
        saveUserInformation({IdNumber: this.searchValue, dateOfBirth: this.dateOfBirth, 
            gender: this.gender, saCitizen: this.saCitizen})
        .then((result) =>{
            if(result === "Insert Success" || result === "Update Success"){    
                this.searchValue = "";
                this.showBtnSubmit = true;
                this.showData = true;
                this.year = this.dateOfBirth.substring(6);
                this.code = this.saCitizen==true?'ZA':null;
            }
        })
        .catch((error) =>{
            const evt = new ShowToastEvent({
                title: "Oops",
                message: error.body.message,
                variant: "error"
            });
            this.dispatchEvent(evt);
        });    
    }

    handleFocus(){
        if(this.searchValue === ""){
            this.showData = false;
        }
    }
}