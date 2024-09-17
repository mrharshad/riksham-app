import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const updateDetails = createAsyncThunk(
  "updateDetails",
  async (query) => {
    const request = await fetch(`/api/admin/user/update-details`, {
      method: "PUT",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await request.json();
  }
);
export const getDistricts = createAsyncThunk(
  "getDistricts",
  async (pinCode) => {
    const request = await fetch(`/api/all/districts?state=${pinCode}`);
    return await request.json();
  }
);

export const addToCartPro = createAsyncThunk("addToCartPro", async (query) => {
  let request = await fetch(`/api/admin/user/product/addToCartPro`, {
    method: "PUT",
    body: JSON.stringify(query),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await request.json();
});
export const deleteCartPro = createAsyncThunk("deleteCartPro", async (_id) => {
  let request = await fetch(
    `/api/admin/user/product/cart-pro-delete?_id=${_id}`
  );
  const response = await request.json();
  return { _id, ...response };
});
export const getMyOrders = createAsyncThunk(
  "getMyOrders",
  async ({ opened, page, searchKey }) => {
    let request = await fetch(
      `/api/admin/user/product/${
        opened == "newOrder" ? "new-order" : "processed"
      }`,
      {
        method: "PUT",
        body: JSON.stringify({ page, searchKey, opened }),
        headers: { "Content-Type": "application/json" },
      }
    );
    return await request.json();
  }
);

const UserSlice = createSlice({
  name: "user",
  initialState: {},

  reducers: {
    commonUser: (state, action) => {
      const { oldToken, oldData } = action.payload;
      state.data = oldData;
      state.token = oldToken;
      state.canceled = [];
      state.newOrder = [];
      state.delivered = [];
      const { width, height } = window.screen;
      state.device =
        width <= 480 && height < 1000
          ? "Mobile"
          : width <= 900 && height < 2000
          ? "Tab"
          : "Desktop";
    },
    userKeyChange: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    dataValueChange: (state, action) => {
      const { name, value } = action.payload;
      state.data[name] = value;
    },
    logOut: (state, action) => {
      state.data = {};
      state.nOfNOrder = 0;
      state.numOfCartP = 0;
      state.token = "";
    },
    cartProductSet: (state, action) => {
      const { index, data } = action.payload;
      const loadingCart = state.loadingCart;
      if (loadingCart)
        state.loadingCart =
          loadingCart.length > 1
            ? loadingCart.filter((proId) => proId !== data._id)
            : undefined;

      state.data.cartPro[index] = data;
    },
    cartProLoading: (state, action) => {
      const loadingCart = state.loadingCart;
      const _id = action.payload;
      if (loadingCart) state.loadingCart.push(_id);
      else state.loadingCart = [_id];
    },

    proOrderResult: (state, action) => {
      const { success, message, newOrder, ...resData } = action.payload;
      let sos;
      if (success) {
        sos = { type: "Success", message };
        state.loadingCart = undefined;
        state.total = {};
        state.newOrder.push(newOrder);
        state.data = Object.assign(state.data, resData);
      }
      state.uSOS = sos || { type: "Error", message, time: 4000 };
    },
    orderInfoManage: (state, action) => {
      const { name, value } = action.payload;
      if (state.orderInfo) state.orderInfo[name] = value;
      else state.orderInfo = { [name]: value };
    },
    lOrderSet: (state, action) => {
      const value = action.payload;
      if (!state.loadingOrder) state.loadingOrder = value;
      if (!state.orderInfo) state.orderInfo = {};
    },
    dOrderGet: (state, action) => {
      const { key, keyArr } = action.payload;
      state.orderInfo.opened = key ? "key" : "delivered";
      if (key) state.loadingOrder = true;
      state.orderInfo.searchKey = key;
      if (!keyArr) state.key = [];
    },
    login: (state, action) => {
      const { message, data } = action.payload;
      state.uSOS = { type: "Success", message };
      state.data = data;
      state.token = data.token;
    },

    logOut: (state, action) => {
      const { success, message } = action.payload;
      state.uSOS = { type: success ? "Success" : "Error", message };
      state.canceled = [];
      state.newOrder = [];
      state.delivered = [];
      state.data = { cartPro: [], numOfCartP: 0 };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateDetails.pending, (state, action) => {
      state.uSos = true;
    });
    builder.addCase(updateDetails.fulfilled, (state, action) => {
      const { success, message, data = {} } = action.payload;
      state.uSos = { type: success ? "Success" : "Error", message };
      state.data = Object.assign(state.data, data);
    });
    builder.addCase(updateDetails.rejected, (state, action) => {
      state.uSos = { type: "Error", message: action.error.message };
    });

    builder.addCase(addToCartPro.fulfilled, (state, action) => {
      const { success, message, obj } = action.payload;

      if (success) {
        state.data.cartPro.push(obj);
        ++state.data.numOfCartP;
      } else {
        const btn = document.getElementById("addToCartBtn");
        if (btn) btn.style.backgroundColor = "revert-layer";
        state.uSOS = { type: "Error", message, time: 4000 };
      }
    });
    builder.addCase(getDistricts.pending, (state, action) => {
      state.uSOS = true;
    });
    builder.addCase(getDistricts.fulfilled, (state, action) => {
      state.data.districts = action.payload.districts;
      state.uSOS = false;
    });

    builder.addCase(deleteCartPro.fulfilled, (state, action) => {
      const { success, _id, message } = action.payload;
      if (success) {
        const cartPro = state.data.cartPro.filter((cart) => cart._id != _id);
        state.data.cartPro = cartPro;
        state.data.numOfCartP = cartPro.length;
        const loadingCart = state.loadingCart;
        state.loadingCart =
          loadingCart?.length > 1
            ? loadingCart.filter((proId) => proId !== _id)
            : undefined;
        state.uSOS = { type: "Success", message };
      } else state.uSOS = { type: "Error", message, time: 5000 };
    });

    builder.addCase(getMyOrders.fulfilled, (state, action) => {
      const { success, message, data, opened, newPage } = action.payload;
      console.log(
        " success, message, data, opened, newPage ",
        success,
        message,
        data,
        opened,
        newPage
      );
      state.loadingOrder = false;
      if (success) {
        if (opened == "key") state.key = data;
        else state[opened].push(...data);
        state.orderInfo[opened + "P"] = newPage;
        state.orderInfo.opened = opened;
      } else state.uSOS = { type: "Error", message, time: 5000 };
    });
  },
});

export const {
  commonUser,
  userKeyChange,
  logOut,
  dataValueChange,
  cartProductSet,
  cartProLoading,
  proOrderResult,
  orderInfoManage,
  lOrderSet,
  dOrderGet,
  login,
} = UserSlice.actions;
export default UserSlice.reducer;
