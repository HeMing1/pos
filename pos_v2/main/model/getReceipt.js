'use strict'

class GetReceipt {
	countBarcodeNum(tags) {
		let barcodeAndCounts = [];
		tags.forEach(function (tag) {
			let barcode = tag, count = 1;
			if (tag.indexOf("-") > 0) {
				barcode = tag.split("-")[0];
				count = parseFloat(tag.split("-")[1]);
			}
			let indexOfCurrent = 0;
			if (barcodeAndCounts.some((currentItem, index) => {
					indexOfCurrent = index;
					return barcode === currentItem.barcode;
				})) {
				barcodeAndCounts[indexOfCurrent].count += count;
			}
			else {
				barcodeAndCounts.push({barcode, count});
			}
		});
		return barcodeAndCounts;
	}

	getItemsInfo(barcodeAndCounts) {
		let allItems = Item.all();
		let itemsInfo = [];
		barcodeAndCounts.forEach(function (barcodeAndCount) {
			allItems.forEach(function (item) {
				if (barcodeAndCount.barcode === item.barcode) {
					item.count = barcodeAndCount.count;
					itemsInfo.push(item);
				}
			});
		});
		return itemsInfo;
	}

	calculateReceipt(itemsInfo) {
		let promotions = Promotion.all();
		let itemsReceipt = [];
		let originalPrice = 0, totalReceipt = 0, saved = 0;
		itemsInfo.forEach(function (itemInfo) {
			let type = "";
			promotions.forEach(function (promotion) {
				if (promotion.barcodes.indexOf(itemInfo.barcode) > -1) {
					type = promotion.type;
				}
			});
			let receipt = itemInfo.price * itemInfo.count;
			originalPrice += receipt;
			if (type === "BUY_TWO_GET_ONE_FREE") {
				receipt = itemInfo.price * (itemInfo.count - parseInt(itemInfo.count / 3));
			}
			totalReceipt += receipt;
			saved = originalPrice - totalReceipt;
			itemInfo.receipt = receipt;
			itemsReceipt.push(itemInfo);
		});
		return {itemsReceipt, totalReceipt, saved};
	}
}

module.exports = GetReceipt;
