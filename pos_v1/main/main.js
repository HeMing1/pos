'use strict';

function printReceipt(tags) {
	let barcodeAndCounts = countBarcodeNum(tags);
	let itemsInfo = getItemsInfo(barcodeAndCounts);
	let itemsReceipt = calculateReceipt(itemsInfo);
	console.log(formatString(itemsReceipt));
}
function countBarcodeNum(tags) {
	let barcodeAndCounts = [];
	tags.forEach(tag => {
		let barcode = tag, count = 1;
		if (tag.indexOf("-") > 0) {
			barcode = tag.split("-")[0];
			count = parseFloat(tag.split("-")[1]);
		}
		let existedItem = barcodeAndCounts.find((item) => {
			return barcode === item.barcode;
		});
		if (existedItem != null) {
			existedItem.count += count;
		} else {
			barcodeAndCounts.push({barcode, count});
		}
	});
	return barcodeAndCounts;
}

function getItemsInfo(barcodeAndCounts) {
	let allItems = loadAllItems();

	let itemsInfo = barcodeAndCounts.map((barcodeAndCount) => {
		let itemDetail = allItems.filter((item) => {
			return item.barcode === barcodeAndCount.barcode;
		});
		return Object.assign({}, itemDetail, {"count": barcodeAndCount.count});
	});

	return itemsInfo;
}

function calculateReceipt(itemsInfo) {
	let promotions = loadPromotions();
	let originalPrice = 0, totalReceipt = 0, saved = 0;
	let itemsReceipt = itemsInfo.map(itemInfo => {
		let type = "";
		promotions.forEach(promotion => {
			if (promotion.barcodes.indexOf(itemInfo[0].barcode) > -1) {
				type = promotion.type;
			}
		});
		let receipt = itemInfo[0].price * itemInfo.count;
		originalPrice += receipt;
		if (type === "BUY_TWO_GET_ONE_FREE") {
			receipt = itemInfo[0].price * (itemInfo.count - parseInt(itemInfo.count / 3));
		}
		totalReceipt += receipt;
		saved = originalPrice - totalReceipt;
		return Object.assign({},itemInfo,{receipt});
	});
	return {itemsReceipt, totalReceipt, saved};
}

function formatString(receipt) {
	let receiptStr = "***<没钱赚商店>收据***\n";
	receipt.itemsReceipt.forEach(itemReceipt => {
		receiptStr += "名称：" + itemReceipt[0].name + "，数量：" + itemReceipt.count + itemReceipt[0].unit + "，单价：" + itemReceipt[0].price.toFixed(2) + "(元)，小计：" + itemReceipt.receipt.toFixed(2) + "(元)\n";
	});
	receiptStr += "----------------------\n总计：" + receipt.totalReceipt.toFixed(2) + "(元)\n节省：" + receipt.saved.toFixed(2) + "(元)\n**********************";
	return receiptStr;

}
