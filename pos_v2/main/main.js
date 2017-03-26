'use strict';

function printReceipt(tags) {
	let getReceipt = new GetReceipt();
	let barcodeAndCounts = getReceipt.countBarcodeNum(tags);
	let itemsInfo = getReceipt.getItemsInfo(barcodeAndCounts);
	let itemsReceipt = getReceipt.calculateReceipt(itemsInfo);
	console.log(formatString(itemsReceipt));
}

function formatString(receipt) {
	let receiptStr = "***<没钱赚商店>收据***\n";
	receiptStr += TimeUtil.getCurrentTime();
	receiptStr += "----------------------\n";
	receipt.itemsReceipt.forEach( (itemReceipt)=> {
		receiptStr += "名称：" + itemReceipt.name + "，数量：" + itemReceipt.count + itemReceipt.unit + "，单价：" + itemReceipt.price.toFixed(2) + "(元)，小计：" + itemReceipt.receipt.toFixed(2) + "(元)\n";
	});
	receiptStr += "----------------------\n总计：" + receipt.totalReceipt.toFixed(2) + "(元)\n节省：" + receipt.saved.toFixed(2) + "(元)\n**********************";
	return receiptStr;
}

