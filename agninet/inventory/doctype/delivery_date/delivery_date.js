// Copyright (c) 2023, Abhiraaj R C and contributors
// For license information, please see license.txt

frappe.ui.form.on('Delivery Date', {
	// refresh: function(frm) {

	// }
});

// Payment Terms

frappe.ui.form.on('Delivery Date', {
	po_number: function(frm) {
		frappe.model.with_doc('PO', frm.doc.po_number, function() {
			var t= frappe.model.get_doc('PO', frm.doc.po_number);
			var name= '';
			$.each(t.payment_terms, function(index, row){
				name += `${row.percentage_amount}% Payment ${row.number_of_days} ${row.days_months} ${row.type}\n`;
			});
			frm.set_value('payment_terms', name);
		});
	}
});

// Child table calc

frappe.ui.form.on("Delivery Date", {
    "po_number2": function(frm) {
        frappe.model.with_doc("PO", frm.doc.po_number2, function() {
            var t= frappe.model.get_doc("PO", frm.doc.po_number2);
            $.each(t.payment_terms, function(index, row){
                var d= frm.add_child("payment_amount");
                d.percentage = row.percentage_amount;
                d.mode_of_payment = row.mode_of_payment;
                if(String(row.type)=="After Delivery") {d.due_date = frappe.datetime.add_days(frm.doc.delivery_date_data, row.number_of_days)}
                if(String(row.type)=="Before Dispatch") {d.due_date = frappe.datetime.add_days(frm.doc.delivery_date_data, -row.number_of_days)}
                if(String(row.type)=="After Inspection") {d.due_date = frappe.datetime.add_days(frm.doc.delivery_date_data, row.number_of_days)}
                if(String(row.type)=="After Acceptance") {d.due_date = frappe.datetime.add_days(frm.doc.delivery_date_data, row.number_of_days)}
                if(String(row.type)=="Advance Along with PO") {d.due_date = frappe.datetime.add_days(frm.doc.delivery_date_data, row.number_of_days)}
                if(String(row.type)=="Every Month after Delivery") {d.due_date = frappe.datetime.add_days(frm.doc.delivery_date_data, row.number_of_days)}
                frm.refresh_field("payment_amount");
            });
        });
    }
});
