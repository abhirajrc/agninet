import frappe
from erpnext.accounts.doctype.purchase_invoice.purchase_invoice import PurchaseInvoice
from pycoingecko import CoinGeckoAPI


class PurchaseInvoiceCustom(PurchaseInvoice):
    """
    Inherit core Sales Invoice and extend it.
    """
    def get_crypto_prices(self):
        """
        Get grand total in  BTC, ETH
        """
        cg = CoinGeckoAPI()
        prices = frappe._dict(cg.get_price(ids=['bitcoin', 'litecoin', 'ethereum'], vs_currencies=self.currency))

        print('GETTING PRICES, \n\n\n\n')

        return {
            'bitcoin': self.grand_total/prices.bitcoin[self.currency.lower()],
            'ethereum': self.grand_total/prices.ethereum[self.currency.lower()]
        } 