public with sharing class APIController {

    @AuraEnabled(cacheable=true)
    public static string getPublicHolidays(String country, String year){
        String endpointURL = 'https://calendarific.com/api/v2/holidays?&api_key=24c5e86734eb44dc4a962826324a5546e74dc42f&country='+country+'&year='+year;

        HttpRequest httpRequest = new HttpRequest();

        httpRequest.setEndPoint(endpointURL);
        httpRequest.setMethod('GET');

        Http http = new Http();

        HttpResponse httpResponse = http.send(httpRequest);

        String responseBody = httpResponse.getBody();
        system.debug('Response Body: ' + responseBody);
        system.debug('Status Code: ' + httpResponse.getStatusCode());

        if(httpResponse.getStatusCode() == 200){
            return httpResponse.getBody();
        }else{
            return 'Error: ' + httpResponse.getStatusCode() + ' ' + httpResponse.getStatus();
        }
    }
}