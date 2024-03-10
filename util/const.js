export const BASE_URL = "https://658ec80e2871a9866e79ca97.mockapi.io/api/";

export const getCardListFromLocal = () => {
    let res = localStorage.getItem("cartList");
  
    if (res) {
      return JSON.parse(res);
    }
    return [];
  };
