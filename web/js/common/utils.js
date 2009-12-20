 function pauseJS(timeInMilliS) {
            var date = new Date();
            var curDate = null;
            do { curDate = new Date(); }
            while(curDate-date < timeInMilliS);
}