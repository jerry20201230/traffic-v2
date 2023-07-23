//date   -> formated str (y/m/d)
//time   -> formated str (h:m:s)
//time-s -> formated str (h:m)
//pack   -> {year,month,date,day,hour,minute,second}
function getTime(type, date) {
    var DATE;
    if (date) { DATE = new Date(date) } 
    else { DATE = new Date() }
    var year = DATE.getFullYear(),
        mont = DATE.getMonth() + 1,
        date = DATE.getDate(),
        day = DATE.getDay(),
        //--------------------//
        hour = DATE.getHours(),
        mins = DATE.getMinutes(),
        secs = DATE.getSeconds();

    if (type == "date") {
        return `${year}/${mont}/${date}`
    } else

        if (type == "time") {
            return `${hour > 9 ? hour : '0' + hour}:${mins > 9 ? mins : '0' + mins}:${secs > 9 ? secs : '0' + secs}`
        } else
            if (type == "time-s") {
                return `${hour > 9 ? hour : '0' + hour}:${mins > 9 ? mins : '0' + mins}`
            }
            else if (type == "pack") {
                let par = {
                    "year": year,
                    "month": mont,
                    "date": date,
                    "day": day,
                    "hour": hour > 9 ? hour : '0' + hour,
                    "minute": mins > 9 ? mins : '0' + mins,
                    "second": secs > 9 ? secs : '0' + secs
                }

                return par
            }
}
export default getTime