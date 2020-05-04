// See front-end example at: http://codepen.io/notarazi/pen/yMqyXX
// Usage
//  1. Enter sheet name where data is to be written below
    //var SHEET_NAME;   
     
//  2. Run > setup
//
//  3. Publish > Deploy as web app
//    - enter Project Version name and click 'Save New Version'
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously)
//
//  4. Copy the 'Current web app URL' and post this in your form/script action
//
//  5. Insert column names on your destination sheet matching the parameter names of the data you are passing in (exactly matching case)

var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

// If you don't want to expose either GET or POST methods you can comment out the appropriate function
function doGet(e){
 return handleResponse(e);
}
function doPost(e){
 return handleResponse(e);
}
function handleResponse(e) {
 // shortly after my original solution Google announced the LockService[1]
 // this prevents concurrent access overwritting data
 // [1] http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html
 // we want a public lock, one that locks for all invocations
 var lock = LockService.getPublicLock();
 lock.waitLock(30000);  // wait 30 seconds before conceding defeat.

    //Sheet1
     try {
       var action = e.parameter.action;

       if (action == 'create') {
         return create(e);
       } 
       else if (action == 'retrieve') {
         return retrieve(e);
       } 
       else if (action == 'update') {
         return update(e);
       } 
       else if (action == 'delete') {
         return del(e);
       } 
       else if (action == 'findRowId'){
         return findRowId(e.parameter.findstr);
       }
     } catch(e){
       // if error return this
       return ContentService
             .createTextOutput(JSON.stringify({"result":"error", "error": e}))
             .setMimeType(ContentService.MimeType.JSON);
     } finally { //release lock
       lock.releaseLock();
     }


    //Sheet2
    try {
       var action = e.parameter.action;

       if (action == 'create_1') {
         return create_1(e);
       } 
       else if (action == 'retrieve_1') {
         return retrieve_1(e);
       } 
       else if (action == 'update_1') {
         return update_1(e);
       } 
       else if (action == 'delete_1') {
         return del_1(e);
       } 
       else if (action == 'findRowId'){
         return findRowId(e.parameter.findstr);
       }    
     } catch(e){
       // if error return this
       return ContentService
             .createTextOutput(JSON.stringify({"result":"error", "error": e}))
             .setMimeType(ContentService.MimeType.JSON);
     } finally { //release lock
       lock.releaseLock();
     }     
    
}
function getDataArr(headers, e){
   var row = [];

   // loop through the header columns
   for (i in headers){
     var d= new Date();
     if (headers[i] == "tid"){ // special case if you include a unix Timestamp column
       row.push(d.getTime());
     }else if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column
       row.push(new Date());
     } else { // else use header name to get data
       row.push(e.parameter[headers[i]]);
     }
   }
 
   return row;
}
function create0(e){
   // return json success results
   return ContentService
         .createTextOutput(JSON.stringify({"result":"success", "row": 99}))
         .setMimeType(ContentService.MimeType.JSON);

}
function findRowId(data) {
 var SHEET_NAME = "Published Online"; 
 var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
 var sheet = doc.getSheetByName(SHEET_NAME);
 //var column = sheet.getRange(column + ":" + column);  // like A:A
 var column = sheet.getRange(1,1,sheet.getLastRow(),1);  
 var values = column.getValues();

 var data1=Number(data);
 var row = 0;
 var result = 0;
 while ( values[row] && values[row][0] !== data ) {
   row++;
 }

 if (values[row][0] === data)
   result= row+1;
 else
   result = -1;
 
//result += data1;
 return ContentService
   .createTextOutput(JSON.stringify({"result":"success", "values": result}))
   .setMimeType(ContentService.MimeType.JSON);

}
function findInColumn(data) {
 var SHEET_NAME = "Sheet1"; 
 var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
 var sheet = doc.getSheetByName(SHEET_NAME);
 //var column = sheet.getRange(column + ":" + column);  // like A:A
 var column = sheet.getRange(1,1,sheet.getLastRow(),1);  
 var values = column.getValues();

 //data=1490461629269;
 var testdata = Number(data);
 var row = 0;

 while ( values[row] && values[row][0] !== testdata ) {
   row++;
 }


 if (values[row][0] === testdata)
   return row+1;
 else
   return -1;
 

//  return ContentService
//    .createTextOutput(JSON.stringify({"result":"success", "values": row}))
//    .setMimeType(ContentService.MimeType.JSON);

}
function findInColumn_s2(data) {
 var SHEET_NAME = "Sheet2"; 
 var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
 var sheet = doc.getSheetByName(SHEET_NAME);
 //var column = sheet.getRange(column + ":" + column);  // like A:A
 var column = sheet.getRange(1,1,sheet.getLastRow(),1);  
 var values = column.getValues();

 //data=1490461629269;
 var testdata = Number(data);
 var row = 0;

 while ( values[row] && values[row][0] !== testdata ) {
   row++;
 }

 if (values[row][0] === testdata)
   return row+1;
 else
   return -1;
 

//  return ContentService
//    .createTextOutput(JSON.stringify({"result":"success", "values": row}))
//    .setMimeType(ContentService.MimeType.JSON);

}

function findInRow(data) {
 var SHEET_NAME = "Published Online"; 
 var sheet = SpreadsheetApp.getActiveSpreadsheet();
 var rows  = sheet.getDataRange.getValues();

 for (var r=0; r<rows.length; r++) {
   if ( rows[r].join("#").indexOf(data) !== -1 ) {
     return r+1;
   }
 }

 return -1;
 
}

/***********************************************************************************************************************************************************************************/
//SHEET 1 CREATE
function create(e) {
   var SHEET_NAME = e.parameter.sheet_name || 'Sheet1';
   // next set where we write the data - you could write to multiple/alternate destinations
   var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
   var sheet = doc.getSheetByName(SHEET_NAME);
 
   // we'll assume header is in row 1 but you can override with header_row in GET/POST data
   var headRow = e.parameter.header_row || 1;
   var numColumns = sheet.getLastColumn();
   var headers = sheet.getRange(1, 1, 1, numColumns).getValues()[0];
   var nextRow = sheet.getLastRow()+1; // get next row
   var row = getDataArr(headers, e);
   // more efficient to set values as [][] array than individually
   sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
   // return json success results
   return ContentService
         .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
         .setMimeType(ContentService.MimeType.JSON);
}
//SHEET 1 RETRIEVE
function retrieve(e) {
 var SHEET_NAME = e.parameter.sheet_name || 'Sheet1'; 
 var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
 var sheet = doc.getSheetByName(SHEET_NAME);
 var numRows = sheet.getLastRow();
 var numColumns = sheet.getLastColumn();
 var range =  sheet.getRange(1, 1, numRows, numColumns);
 var values = range.getValues();
 
 return ContentService
   .createTextOutput(JSON.stringify({"result":"success", "values": values}))
   .setMimeType(ContentService.MimeType.JSON);
}
//SHEET 1 UPDATE
function update(e) {
    var SHEET_NAME = e.parameter.sheet_name || 'Sheet1';
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    var numColumns = sheet.getLastColumn();

    var rowId = findInColumn(e.parameter.tid);



    var headers = sheet.getRange(1, 1, 1, numColumns).getValues()[0];
    var row = getDataArr(headers, e);
    //var rowId = e.parameter.rowId;
    var tid= row[0];

    // more efficient to set values as [][] array than individually
    sheet.getRange(rowId, 1, 1, numColumns).setValues([row]);
    // return json success results
    return ContentService
     .createTextOutput(JSON.stringify({"result":"success", "tid": tid}))
     .setMimeType(ContentService.MimeType.JSON);
}
//SHEET 1 DELETE
function del(e) {
 var SHEET_NAME = e.parameter.sheet_name || 'Sheet1'; 
 var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
 var sheet = doc.getSheetByName(SHEET_NAME);
 var rowId = findInColumn(e.parameter.tid);

  
 sheet.deleteRow(rowId);
 // return json success results
 return ContentService
     .createTextOutput(JSON.stringify({"result":"success", "rowId": rowId}))
     .setMimeType(ContentService.MimeType.JSON);   
  
  
}
/***********************************************************************************************************************************************************************************/

/***********************************************************************************************************************************************************************************/
//SHEET 2 CREATE
function create_1(e) {
   var SHEET_NAME = e.parameter.sheet_name || 'Sheet2';
   // next set where we write the data - you could write to multiple/alternate destinations
   var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
   var sheet = doc.getSheetByName(SHEET_NAME);
 
   // we'll assume header is in row 1 but you can override with header_row in GET/POST data
   var headRow = e.parameter.header_row || 1;
   var numColumns = sheet.getLastColumn();
   var headers = sheet.getRange(1, 1, 1, numColumns).getValues()[0];
   var nextRow = sheet.getLastRow()+1; // get next row
   var row = getDataArr(headers, e);
   // more efficient to set values as [][] array than individually
   sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
   // return json success results
   return ContentService
         .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
         .setMimeType(ContentService.MimeType.JSON);
}
//SHEET 2 RETRIEVE
function retrieve_1(e) {
 var SHEET_NAME = e.parameter.sheet_name || 'Sheet2'; 
 var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
 var sheet = doc.getSheetByName(SHEET_NAME);
 var numRows = sheet.getLastRow();
 var numColumns = sheet.getLastColumn();
 var range =  sheet.getRange(1, 1, numRows, numColumns);
 var values = range.getValues();
 
 return ContentService
   .createTextOutput(JSON.stringify({"result":"success", "values": values}))
   .setMimeType(ContentService.MimeType.JSON);
}
//SHEET 2 UPDATE
function update_1(e) {
    var SHEET_NAME = e.parameter.sheet_name || 'Sheet2';
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    var numColumns = sheet.getLastColumn();

    var rowId = findInColumn_s2(e.parameter.tid);



    var headers = sheet.getRange(1, 1, 1, numColumns).getValues()[0];
    var row = getDataArr(headers, e);
    //var rowId = e.parameter.rowId;
    var tid= row[0];

    // more efficient to set values as [][] array than individually
    sheet.getRange(rowId, 1, 1, numColumns).setValues([row]);
    // return json success results
    return ContentService
     .createTextOutput(JSON.stringify({"result":"success", "tid": tid}))
     .setMimeType(ContentService.MimeType.JSON);
}
//SHEET 2 DELETE
function del_1(e) {
 var SHEET_NAME = e.parameter.sheet_name || 'Sheet2'; 
 var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
 var sheet = doc.getSheetByName(SHEET_NAME);
 var rowId = findInColumn_s2(e.parameter.tid);

 sheet.deleteRow(rowId);
 // return json success results
 return ContentService
     .createTextOutput(JSON.stringify({"result":"success", "rowId": rowId}))
     .setMimeType(ContentService.MimeType.JSON);   

}
/***********************************************************************************************************************************************************************************/


//SETUP
function setup() {
   var doc = SpreadsheetApp.getActiveSpreadsheet();
   SCRIPT_PROP.setProperty("key", doc.getId());
}
