export const IsNumberString = (str) => (/^\d+$/).test(str)
export const IsEmpty = (str) => !(str && str.trim().length)
export const SecondDiffBetweenToDates = ( date1, date2 = Date.now()) =>{

    var t2 = new Date(date1);
    var t1 = new Date(date2);
    var dif = t2.getTime() - t1.getTime();
    var Seconds_from_T1_to_T2 = dif / 1000;

   return Math.floor(Seconds_from_T1_to_T2);

}

export const secondDiffBetweenTwoDateTimes = (dateTimes) => (( new Date(dateTimes).getTime() - new Date().getTime()) / 1000)

export const validateEmail= (email) => {
        var re = /\S+@\S+\.\S+/
        return re.test(email)
}

export const monthInLeter=['January','February','March','April','May','June','July','August','September','October','November','December']

export const genRandomInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min
//45896 = 5
export const getlength=(number)=>number.toString().length
 //548 = 000548
export const fillWithZero = (number,fillLength=6) => {

        const lenghtOfNumber = getlength(number)
        let output = number.toString()

        if(lenghtOfNumber < fillLength){
            for(let i=0;i<fillLength-lenghtOfNumber;i++){
                output ='0'+output
            }
            return output
        }
        else{
            return output
        }
}

//*OYY!3@U6.y
export const generateRandomString = (min, max) => {
       
        let input = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",0,1,2,3,4,5,6,7,8,9,'|','?','/','&','*','%','$','@','!','_','-','+',',',')','(','{','}','[',']']
 
        let stringNumber =  genRandomInRange(min, max) ,inputLength = input.length
        let randomString = '';
          for(let i=0;i<stringNumber;i++){
               
               randomString += input[genRandomInRange(0,inputLength)]
          }
 
          return randomString
 
     }
