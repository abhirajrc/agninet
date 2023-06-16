// Copyright (c) 2023, Abhiraaj R C and contributors
// For license information, please see license.txt

frappe.ui.form.on('PO Number', {
	before_save: function(frm) {

			frappe.confirm('Are you sure you want to proceed?',
			() => {
			},
			'Continue',
			true // Sets dialog as minimizable
			)
	},
});