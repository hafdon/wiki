function sendInlineEmail() {

    var message = '';

    var ss = SpreadsheetApp.getActive();
    var sheetPortal = ss.getSheetByName('Form Responses 1');

    var dataRange = sheetPortal.getDataRange();
    var lastrowIndex = dataRange.getLastRow();
    var data = dataRange.getValues();

    var lastrow = data[lastrowIndex - 1];
    var firstrow = data[0];

    // 0-index
    var staff_email = lastrow[1].toString(); // + ', director@jmrl.org';
    var staff_name = lastrow[4].toString();
    // var department = lastrow[2].toString();
    // var dept_email = get_dept_email(department);
    var email = []
    email.push(staff_email)
    // email.push(dept_email)
    email.push(get_auto_emails())
    email = email.join(',');


    var htmltable = generate_html_table(firstrow, lastrow);


    MailApp.sendEmail({
        to: email,
        subject: 'Employee Exit/Transfer Form for ' + staff_name,
        body: message,
        htmlBody: htmltable,
    });


};


/**

Returns the HTML table from the first row (header) and last row (most recent submission) from the form/spreadsheet

*/
function generate_html_table(firstrow, lastrow) {

    var TABLEFORMAT = 'cellspacing="2" cellpadding="2" dir="ltr" border="1" style="width:100%;table-layout:fixed;font-size:10pt;font-family:arial,sans,sans-serif;border-collapse:collapse;border:1px solid #ccc;font-weight:normal;color:black;background-color:white;text-align:left;text-decoration:none;font-style:normal;'

    var htmltable = '<table ' + TABLEFORMAT + ' ">';

    for (var i = 0; i < firstrow.length; i++) {

        htmltable += '<tr>';
        htmltable += '<td>' + firstrow[i].toString() + '</td>';
        htmltable += '<td>' + lastrow[i].toString() + '</td>';
        htmltable += '</tr>'

    }

    /** Add IT checklist */
    htmltable += '<tr>';
    htmltable += '<td>IT USE ONLY</td>';
  htmltable += '<ul>'
  htmltable += '<li>__ email/forward</li>'
  htmltable += '<li>__ google Emp. ID</li>'
  htmltable += '<li>__ groups</li>'
  htmltable += '<li>__ stf intranet</li>'
  htmltable += '<li>__ Sierra</li>'
  htmltable += '<li>__ MRBS ?</li>'
  htmltable += '<li>__ SDP</li>'
  htmltable += '<li>__ leave reportal</li>'
  htmltable += '<li>__ VLA (biz mgr)</li>'
  htmltable += '<li>__ notify manager</li>'
  htmltable += '<li>__ headshot</li>'
  htmltable += '<li>__ phone #</li>'
  htmltable += '<li>Completed by & date:</li>'
  htmltable += '</ul>'

    htmltable += '</tr>'

    /** End the table */

    htmltable += "</table>";

    return htmltable;

};

/**
function get_dept_email(department ) {

  var ss = SpreadsheetApp.getActive();
  var dept_to_email_sheet = ss.getSheetByName('dept_to_email');
  
    var dataRange = dept_to_email_sheet.getDataRange();
  var lastrowIndex = dataRange.getLastRow();
  var data = dataRange.getValues();
  
  var dept_to_email_hash = {};
  
  
  for (let i = 1; i < lastrowIndex; i++) {
  dept_to_email_hash[ data[i][0].toString() ] = data[i][1];
  }
  
  return dept_to_email_hash[department]

};
*/

function get_auto_emails() {

    var ss = SpreadsheetApp.getActive();
    var sheet = ss.getSheetByName('auto_email');

    var dataRange = sheet.getDataRange();
    var lastrowIndex = dataRange.getLastRow();
    var data = dataRange.getValues();

    var emails = []
    for (let i = 0; i < lastrowIndex; i++) {
        emails.push(data[i][0]);
    }

    return emails;

};
