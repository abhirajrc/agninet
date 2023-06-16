// Copyright (c) 2023, Abhiraaj R C and contributors
// For license information, please see license.txt

// frappe.ui.form.on('Payment', {
// 	refresh: function(frm) {

//         frappe.set_route('List', 'Payment', 'List', {'payment_table.transaction_id':my_specific_transaction_id});

// 	}
// });

// Child table calc

frappe.ui.form.on("Payment", {
    "po_number": function(frm) {
        frappe.model.with_doc("Delivery Date", frm.doc.po_number, function() {
            var t= frappe.model.get_doc("Delivery Date", frm.doc.po_number);
            frm.doc.delivery_date = t.deli_date;
            frm.refresh_field("delivery_date");
            console.log(frm.doc.delivery_date);
        })
            
        if (frm.doc.delivery_date) {
                frappe.model.with_doc("Invoice Amount", frm.doc.po_number, function() {
                    var t= frappe.model.get_doc("Invoice Amount", frm.doc.po_number);
                    if (t.invoice_amount){
                        frm.doc.total_amount = t.invoice_amount;
                        frm.refresh_field("total_amount");
                        console.log(frm.doc.total_amount);
                    }
                })
            }

        else {
                frappe.model.with_doc("PO", frm.doc.po_number, function() {
                    var r= frappe.model.get_doc("PO", frm.doc.po_number)
                    if (r.amount_payable1) {
                        frm.doc.total_amount = r.amount_payable1;
                        frm.refresh_field("total_amount");
                        console.log(frm.doc.total_amount);
                    }
                })
            }

        frappe.model.with_doc("PO", frm.doc.po_number, function() {
            var t= frappe.model.get_doc("PO", frm.doc.po_number);
            $.each(t.payment_terms, function(index, row){
                var d= frm.add_child("payment_amount");
                d.percentage = row.percentage_amount;
                d.mode_of_payment = row.mode_of_payment;
                if(frm.doc.delivery_date!=null) {
                    if(String(row.type)=="After Delivery") {d.due_date = frappe.datetime.add_days(frm.doc.delivery_date, row.number_of_days)}
                    if(String(row.type)=="Before Dispatch") {d.due_date = frappe.datetime.add_days(frm.doc.delivery_date, -row.number_of_days)}
                    if(String(row.type)=="After Inspection") {d.due_date = frappe.datetime.add_days(frm.doc.delivery_date, row.number_of_days)}
                    if(String(row.type)=="After Acceptance") {d.due_date = frappe.datetime.add_days(frm.doc.delivery_date, row.number_of_days)}
                    if(String(row.type)=="Advance Along with PO") {d.due_date = frappe.datetime.add_days(frm.doc.delivery_date, row.number_of_days)}
                    if(String(row.type)=="Every Month after Delivery") {d.due_date = frappe.datetime.add_days(frm.doc.delivery_date, row.number_of_days)}
                    frm.refresh_field("payment_amount");
                }
                else {
                    if(String(row.type)=="After Delivery") {d.due_date = frappe.datetime.add_days(t.purchase_order_date, t.lead_time)}
                    if(String(row.type)=="Before Dispatch") {d.due_date = frappe.datetime.add_days(t.purchase_order_date, t.lead_time)}
                    if(String(row.type)=="After Inspection") {d.due_date = frappe.datetime.add_days(t.purchase_order_date, t.lead_time)}
                    if(String(row.type)=="After Acceptance") {d.due_date = frappe.datetime.add_days(t.purchase_order_date, t.lead_time)}
                    if(String(row.type)=="Advance Along with PO") {d.due_date = frappe.datetime.add_days(t.purchase_order_date, t.lead_time)}
                    if(String(row.type)=="Every Month after Delivery") {d.due_date = frappe.datetime.add_days(t.purchase_order_date, t.lead_time)}
                    frm.refresh_field("payment_amount");
                }
            });
        });
    }
});

// Amount
frappe.ui.form.on("Payment", "po_number", function(frm) { 
    for ( let i in frm.doc.payment_amount){
    frm.doc.payment_amount[i].amount = frm.doc.payment_amount[i].percentage * frm.doc.total_amount * 0.01;
    }
    frm.refresh_field("payment_amount"); 
});

frappe.ui.form.on("Payment Table", "po_number", function(frm, cdt, cdn) { 
    var d = locals[cdt][cdn]; 
    frappe.model.set_value(cdt, cdn, "amount", d.percentage * frm.doc.total_amount * 0.01); 
    frm.refresh_field("amount"); 
});

// Payment Terms

frappe.ui.form.on('Payment', {
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

// Outstanding

// frappe.ui.form.on('Payment Table', "transaction_id", function(frm, cdt, cdn) {
//     var d = locals[cdt][cdn];
//     var total = 0;
//     frm.doc.payment_amount.forEach(function(d) { if(d.transaction_id!=null) {total += d.amount} });
//     frm.set_value('outstanding', frm.doc.total_amount - total);
//     frm.refresh_field("outstanding");
    
// });

// Split payment

frappe.ui.form.on("Payment Table", {
    "split_payment": function(frm, cdt, cdn) {
        if("split_payment") {
            var row = locals[cdt][cdn];
            var new_row = frm.add_child('payment_amount');
            // frm.doc.payment_amount.splice(row.idx, 0, frm.add_child('payment_amount'));
            // frm.doc.payment_amount.sort((a, b) => a.idx > b.idx);
            let r = frm.doc.payment_amount.length - 1;
            let len = frm.doc.payment_amount.length - 1;
            let last_idx = frm.doc.payment_amount[len];
            while(last_idx.idx > (row.idx+1)) {
                let old_idx = frm.doc.payment_amount[r];
                frm.doc.payment_amount[r] = frm.doc.payment_amount[r-1];
                frm.doc.payment_amount[r-1] = old_idx;
                frm.doc.payment_amount[r].idx += 1;
                frm.doc.payment_amount[r-1].idx -= 1;
                last_idx = frm.doc.payment_amount[r-1];
                r -= 1;
            }
            // while (r > row.idx) {
            //     let old_idx = frm.doc.payment_amount[r].idx;
            //     frm.doc.payment_amount[r].idx = frm.doc.payment_amount[r-1].idx;
            //     frm.doc.payment_amount[r-1].idx = old_idx;
            //     r -= 1;
            // }
            // frm.doc.payment_amount.sort((a, b) => a.idx > b.idx);
            // frm.doc.payment_amount[len].idx = frm.doc.payment_amount[r].idx;
            console.log(frm.doc.payment_amount);
            console.trace('payment_amount');
            frm.refresh_field('payment_amount');
        }        
    },
});


// Transaction ID

frappe.ui.form.on("Payment Table", {
    "status": function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        // frm.doc.payment_amount.forEach(function(d) {
        if(String(d.status)=='Yes') {
        let t = new frappe.prompt({
                label: 'Transaction ID',
                fieldname: 'transaction_id',
                fieldtype: 'Data'
            }, function(values) {
                if(values.transaction_id!=null) {
                    console.log(d);
                    d.transaction_id = values.transaction_id;
                    frm.refresh_field('payment_amount');
                    console.log(values.transaction_id);
                    var total = 0;
                    frm.doc.payment_amount.forEach(function(d) { if(d.transaction_id!=null) {total += d.amount} });
                    frm.set_value('outstanding', frm.doc.total_amount - total);
                    frm.refresh_field("outstanding");
                }
            })
        }
    // })
}
});

// frappe.ui.form.on("Payment", {
//     refresh: function(frm) {
//         let page = frappe.ui.make_app_page({
//             title: 'OLD Payment',
//             parent: wrapper
//         })
//         page.set_indicator("PO Not Delivered", 'red')
//     }
// })