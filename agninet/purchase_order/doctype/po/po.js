// Copyright (c) 2023, Abhiraaj R C and contributors
// For license information, please see license.txt

// Purchase Order Date

// frappe.ui.form.on('PO', {    
//     refresh: function(frm) {

		
// 		frm.add_custom_button(__("Print Button 1"), function() {
// 			frm.set_value("print_format_selector","Agnikul Green")
// 				frm.print_doc();
// 			}); 
// 		frm.add_custom_button(__("Print Button 2"), function() {
// 			frm.set_value("print_format_selector","Test Agnikul Green")
// 				frm.print_doc();
// 			}); 
	   
// 		// set minimum Date
// 		frm.fields_dict.purchase_order_date.datepicker.update({
// 			minDate: frm.doc.purchase_order_date ? new Date(frappe.datetime.get_today()) : null
// 		})
//         // set maximum Date equal today
//         frm.fields_dict.purchase_order_date.datepicker.update({
//             maxDate: frm.doc.purchase_order_date ? new Date(frappe.datetime.get_today()) : null
//         });


//     },
// });

frappe.ui.form.on('PO', {
    validate: function(frm) {
        if(frm.doc.purchase_order_date > get_today()){
            frappe.throw(__('Please select date from the past or present'));
        }
    }
});

// PO Payable

frappe.ui.form.on('PO', {
	po_value: function(frm) {
		if (frm.doc.discount1) {
			let po_payable = (frm.doc.po_value * (1 - (0.01*frm.doc.discount1)))
			frm.set_value('po_payable2', po_payable);
			frm.refresh_field('po_payable2');
		}		
	},

	discount1: function(frm) {
		if (frm.doc.po_value){ 
			let po_payable = (frm.doc.po_value * (1 - (0.01*(frm.doc.discount1))));
			frm.set_value('po_payable2', po_payable);
			frm.refresh_field('po_payable2');
		}
		
	},

	po_payable2: function(frm) {
		if (frm.doc.discount1) {
			let po_payable = (frm.doc.po_payable2 * (1 + (0.01 *(frm.doc.freight2 + frm.doc.p_and_f1))));
			frm.set_value('po_payable1', po_payable);
			frm.refresh_field('po_payable1');
		}
		
	},
	
	freight2: function(frm) {
		if (frm.doc.p_and_f1){ 
			let po_payable_ = (frm.doc.po_payable2 * (1 + (0.01 * frm.doc.freight2)));
			let po_payable0 = (po_payable_ * 0.01* frm.doc.p_and_f1);
			let po_payable = po_payable_ + po_payable0;
			frm.set_value('po_payable1', po_payable);
			frm.refresh_field('po_payable1');
		}
	},
	
	p_and_f1: function(frm) {
		if (frm.doc.freight2){ 
			let po_payable = (frm.doc.po_payable2 * (1 + (0.01 * (frm.doc.freight2 + frm.doc.p_and_f1))));
			frm.set_value('po_payable1', po_payable);
			frm.refresh_field('po_payable1');
		}
	},

	gst1: function(frm) {
		if (frm.doc.discount1){
			let amount_payable1 = (frm.doc.po_payable1 * (1 + (0.01*parseFloat(frm.doc.gst1))));
			frm.set_value('amount_payable1', amount_payable1);
			frm.refresh_field('amount_payable1');
		}
	},
	
	po_payable1: function(frm) {
		if (frm.doc.gst1){
			let amount_payable1 = (frm.doc.po_payable1 * (1 + (0.01*parseFloat(frm.doc.gst1))));
			frm.set_value('amount_payable1', amount_payable1);
			frm.refresh_field('amount_payable1');
		}
	},
});

// PO Value

frappe.ui.form.on('Component Table', {
    
    quantity: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.rate){
            frappe.model.set_value(cdt, cdn, 'value', row.rate*row.quantity);
        }
    },
    
    rate: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.quantity){
            frappe.model.set_value(cdt, cdn, 'value', row.rate*row.quantity);
        }
    },

	value: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if(row.quantity){
			frappe.model.set_value(cdt, cdn, 'rate', row.value/row.quantity);
		}
	}
});

frappe.ui.form.on('Component Table', {
    value: function(frm, cdt, cdn){
        var d = locals[cdt][cdn];
        var total = 0;
        frm.doc.component.forEach(function(d) { total += d.value; });
        frm.set_value('po_value', total);
        refresh_field('po_value');
        
    },
    
    component: function(frm, cdt, cdn){
        var d = locals[cdt][cdn];
        var total = 0;
        frm.doc.component.forEach(function(d) { total += d.value; });
        frm.set_value('po_value', total);
        refresh_field('po_value');
    }
});




// frappe.ui.form.on("PO", { 
// 	validate: function(frm) { 
//     // use the is_new method of frm, to check if the doc is saved or not
//     frm.set_df_property("po_number", "read_only", frm.is_new() ? 0 : 1);
// 	}
// });


// frappe.ui.form.on('PO', {
// 	before_save: function(frm) {

// 		if(frm.doc.po_num) {
// 			frappe.confirm('Are you sure you want to proceed?',
// 			() => {
// 				frm.save();
// 			}, () => {
// 			// action to perform if No is selected
// 			})
// 		}
// 	}
// });


// frappe.ui.form.on('PO', {
// 	print_po: function(frm) {

// 		if('print_po') {
// 			frappe.call({
// 				method:"download_multi_pdf",
// 				doc: frm.doc,
// 				args: {
// 					doctype: {'PO': frm.doc.po_number, 'frm.doc.other_documents': frm.doc.other_documents},
// 					name: 'Combined',
// 				},
// 				// freeze: true,
// 				// freeze_message: __('Calling frm.call Method'),
// 				callback: function(r) {
// 					// frappe.msgprint(r.message);
// 				}
				
// 			});
// 			console.log("Clicked");
// 		}
		
		
// 	}
// })

// frappe.ui.form.on("PO", {
// 	refresh: function(frm) {

// 		// function custom_print(frm){
// 		// 	cur_frm.add_custom_button(__("Print 1"), function() {
// 		// 		cur_frm.set_value("print_format_selector","Agnikul Green")
// 		// 		cur_frm.print_doc();
// 		// 	}); 
// 		frm.add_custom_button(__("Print 2"), function() {
// 			frm.set_value("print_format_selector","Test Agnikul Green")
// 				frm.print_doc();
// 			}, __(Utilities));
// 	}
// // }
// })

// frappe.ui.form.on('PO', {
//     refresh(frm) {
//         frm.add_custom_button("Hello", () => { 
//             msgprint("Hello");
//         }, "Greet");
//         frm.add_custom_button("Ciao", () => { 
//             msgprint("Ciao");
//         }, "Greet");
// 	}
// });

