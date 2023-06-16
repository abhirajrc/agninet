frappe.listview_settings['Payment'] = {


    onload: function (listview) {

        var df = {

            fieldname: "transaction_id",

            label:"Transaction ID",

            fieldtype: "Data",

            // options:"Item",

            onchange: function(){

                listview.start = 0;

                listview.refresh();

                listview.on_filter_change();

            },

        }

        listview.page.add_field(df);

    }

};