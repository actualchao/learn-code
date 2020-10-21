console.log(123);
import defaut from './export'

console.log(defaut);


module.exports = {

  aa : () => {},
  bb: async () => {
    const res = await new Promise.resolve();
    console.log(res);
  }


};