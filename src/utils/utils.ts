export const getCategoryList = (item: any) => {
    let lists: any = item.map((val: any) => val.name);
    return lists;
  };

export const getSubCategoryList = (item: any) => {
    let lists: any = [];
    let allsubcats: any = item.map((val: any) => val.subCategories);

    allsubcats.map((values: any) => {
      values.map((subcat: any) => {
        lists.push(subcat.name);
      });
    });

    return lists;
  };


  export const getSubCategoryListByPassingCategory=(cat:any,data:any)=>{
    let ret:any = []
    let found:any = data.filter((val:any)=>val.name === cat)
    if(found){

        let subcats:any = found[0].subCategories
        ret = subcats.map((item:any)=>item.name)
    }

    return ret
  }


  export const truncate=(text:any,letters:number)=>{
    if(letters>0){
        return text.slice(0,letters) + '...'
    }else{
        return text
    }
  }


