const { add, division, multiplication, subtract } = require('./hw1-islemler');

describe("Test Adds", ()=>{
   //before all: Describe icinde testler calismadan once yapilacak islem
   //after all: Testler calistiktan sonra yapicalack islem
   //Before each: Her bir testten once calismasini saglar
   test("3+5=8",()=>{
      //GIVEN: A ve B degiskenleri numaratik olarak verilmistir
      const a = 3;
      const b = 5;
      //WHEN: Fonksiyon cagrilip a ve b degferleri veriliyor
      let result = add(3,5);
      //THEN: Fonksiyonun 8 cevabini gondermesini bekliyoruz
      expect(result).toBe(8);
   })

   test("3+A= Must Be Digit", ()=>{
      const a = 3;
      const b = "s";

      const result = add(a,b);
      
      expect(result).toThrow("Must be digit");
   })
})

describe("Test Subtracts", ()=>{
   test("7-4=3",()=>{
      const a=7;
      const b=4;
      let result = subtract(a,b);
      expect(result).toBe(3);
   })

   test("7-A= Must be digit",()=>{
      const a=7;
      const b='A';
      expect(()=>{subtract(a,b)}).toThrow("Must be digit");
   })
})

describe("Test Multiplications", ()=>{
   test("2*3=6",()=>{
      const a=2;
      const b=3;
      let result = multiplication(a,b);
      expect(result).toBe(6);
   })

   test("2*A= Must be digit",()=>{
      const a=2;
      const b='A';
      expect(()=>{multiplication(a,b)}).toThrow("Must be digit");
   })
})

describe("Test Divisions", ()=>{
   test("8/4=2",()=>{
      const a=8;
      const b=4;
      let result = division(a,b);
      expect(result).toBe(2);
   })

   test("8/B= Must be digit",()=>{
      const a=8;
      const b='B';
      try{
         division(a,b);
         throw new Error("Yanlis Hata !");
      }catch(error){

         expect(error.message).toBe('Must be digit');
      } 
   })

   test("8/0= Cannot be 0", ()=>{
      const a=8;
      const b=0;
      expect(()=>{division(a,b)}).toThrow("Cannot be 0")
   })
})
