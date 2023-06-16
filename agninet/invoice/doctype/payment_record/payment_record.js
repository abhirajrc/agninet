// Copyright (c) 2023, Abhiraaj R C and contributors
// For license information, please see license.txt

frappe.ui.form.on('Payment Record', {
	// refresh: function(frm) {

	// }
});

frappe.ui.form.on('Payment Record', {
    on_submit: function(frm){
    //  console.log('reloaded doc on submit')
        location.reload()
    },
    onload_post_render: function(frm){
        var bt = ['Delivery', 'Work Order', 'Invoice', 'Material Request', 'Request for Raw Materials', 'Purchase Order', 'Payment Request', 'Payment', 'Project', 'Subscription']
        bt.forEach(function(bt){
            frm.page.remove_inner_button(bt, 'Create')
            });
        frm.page.add_inner_button('Order Raw Materials', () => cur_frm.cscript.make_raw_material_request(), 'Create')
        }
    }
);

// frappe.ui.form.on('Payment Record', {
// 	refresh: function(frm) {
// 		frappe.add_custom_button(__("TEst Button"), function() {
// 			console.log("this is a click");
// 		});
// 		console.log("Tried to load button");
// 	}
// });

// frappe.ui.form.on('Payment Record', {
// 	refresh: function(frm) {
// 		frm.add_custom_button("TEst Button", () => {
// 			frappe.msgprint(__("You Clicked!1"));
// 		});
// 		console.log("Tried to load button");
// 	}
// });