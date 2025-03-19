import { LightningElement, api, wire } from 'lwc';
import getPublicHolidays from '@salesforce/apex/APIController.getPublicHolidays';

export default class DataList extends LightningElement {
    @api year;
    @api country;
    @api showData;
    holidays = [];

    @wire(getPublicHolidays, {country: '$country', year: '$year'})
    wiredHolidays({ error, data }) {
        if (data) {
            this.showData = true;
            const parsedData = JSON.parse(data);
            this.holidays = parsedData.response.holidays.map(holiday => ({
                name: holiday.name,
                description: holiday.description,
                date: holiday.date.iso,
                type: holiday.type[0]
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.holidays = undefined;
        }
    }
}