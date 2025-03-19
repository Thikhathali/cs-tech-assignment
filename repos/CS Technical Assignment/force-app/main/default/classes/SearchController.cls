public with sharing class SearchController {
    @AuraEnabled
    public static string saveUserInformation(String IdNumber, String dateOfBirth, String gender, Boolean saCitizen){
        Integer firstVisitCount = 0;
        try {
            List<Visitor__c> visitor = [SELECT Id, Name, Visit_Count__c FROM Visitor__c WHERE Name =: IdNumber];

            if(!visitor.isEmpty()){
                visitor[0].Visit_Count__c++;

                try{
                    update visitor;
                    return 'Update Success';
                } catch(DMLException e){
                    return e.getMessage();
                }
            }else{
                Visitor__c newVisitor = new Visitor__c();  

                newVisitor.Name = IdNumber;
                newVisitor.Date_Of_Birth__c = dateOfBirth;
                newVisitor.Gender__c = gender;
                newVisitor.SA_Citizen__c = saCitizen;
                newVisitor.Visit_Count__c = firstVisitCount + 1;

                try{
                    insert newVisitor;
                    return 'Insert Success';                    
                } catch(DMLException e){
                    return e.getMessage();
                }
            }            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }    
    }
}