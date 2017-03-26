'use strict';

class TimeUtil {

	static getCurrentTime() {
		const dateDigitToString = num => (num < 10 ? `0${num}` : num);
		const currentDate = new Date(),
			year = dateDigitToString(currentDate.getFullYear()),
			month = dateDigitToString(currentDate.getMonth() + 1),
			date = dateDigitToString(currentDate.getDate()),
			hour = dateDigitToString(currentDate.getHours()),
			minute = dateDigitToString(currentDate.getMinutes()),
			second = dateDigitToString(currentDate.getSeconds());
		return `打印时间：${year}年${month}月${date}日 ${hour}:${minute}:${second}\n`;
	}
}

module.exports = TimeUtil;
