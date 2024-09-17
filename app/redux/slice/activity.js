import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRandom = createAsyncThunk("fetchRandom", async (query) => {
  const { page, intTofP } = query;

  const request = await fetch(`/api/product/random`, {
    method: "POST",
    body: JSON.stringify({ page, intTofP }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await request.json();
});

export const fetchKeyProduct = createAsyncThunk(
  "fetchKeyProduct",
  async (query) => {
    const { keyName, keyPage, searchSort, type } = query;

    const request = await fetch(`/api/product/key-search`, {
      method: "PUT",
      body: JSON.stringify({ keyName, keyPage, searchSort, type }),
      headers: { "Content-Type": "application/json" },
    });
    return await request.json();
  }
);

export const intTofPFunc = createAsyncThunk("intTofPFunc", async (query) => {
  let { intTofP, token, name, searchKeys, indexIntTofP, value } = query;
  let newIntTofP = JSON.parse(JSON.stringify(intTofP));

  let priority = 0;
  if (indexIntTofP >= 0) {
    priority = (value || 1) + newIntTofP[indexIntTofP].priority;
    newIntTofP[indexIntTofP].priority = priority;
    newIntTofP = newIntTofP.sort((a, b) => b.priority - a.priority);
  } else {
    priority = 1;
    newIntTofP.push({ name, page: 1, priority: value || 1 });
  }

  if (Number.isInteger(priority / 3)) {
    let res = {};
    if (token) {
      const request = await fetch(`/api/admin/user/product/intTofP`, {
        method: "POST",
        body: JSON.stringify({ token, newIntTofP, searchKeys }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      res = await request.json();
    } else {
      localStorage.setItem("IntTofP", JSON.stringify(newIntTofP));
      localStorage.setItem("SearchKeys", JSON.stringify(searchKeys));
    }
    res.newIntTofP = newIntTofP;
    return res;
  } else {
    return { newIntTofP };
  }
});
export const removeSearchKeys = createAsyncThunk(
  "removeSearchKeys",
  async (query) => {
    let { keyName, searchKeys, token, oldSearchKeys } = query;
    let newSearchKeys = searchKeys.filter((keys) => keys.name !== keyName);
    oldSearchKeys = Array.isArray(oldSearchKeys)
      ? oldSearchKeys.map((keyObj) => JSON.parse(keyObj))
      : [];

    const exist = oldSearchKeys.some((keys) => keys.name === keyName);
    if (token && exist) {
      let res = {};
      const request = await fetch(`/api/admin/user/product/search-delete`, {
        method: "POST",
        body: JSON.stringify({ token, newSearchKeys }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      res = await request.json();
      res.newSearchKeys = newSearchKeys;
      return res;
    } else {
      localStorage.setItem("SearchKeys", JSON.stringify(newSearchKeys));
      return { newSearchKeys };
    }
  }
);

const ActivitySlice = createSlice({
  name: "activity",
  initialState: {
    products: [],
    intTofP: [],
    loadingA: false,
    searchPro: [],
    search: {},
    searchSort: "Popular",
    page: 1,
    aSOS: false,
    searchKeys: [],
    categoryKeys: [],
  },

  reducers: {
    commonActivity: (state, action) => {
      const { oldIntOfP, oldSearchKeys } = action.payload;
      const localData = (name) => {
        try {
          let data = JSON.parse(localStorage.getItem(name));
          return Array.isArray(data) ? data : null;
        } catch (err) {
          localStorage.setItem(name, "[]");
          return null;
        }
      };
      state.searchKeys =
        (oldSearchKeys || localData("SearchKeys"))?.map((key) => {
          const newKey = { ...key };
          if (key.cached) {
            newKey.cached = [{ page: 1, sorted: "Popular" }];
          }
          return newKey;
        }) || [];

      state.intTofP =
        (oldIntOfP || localData("IntTofP"))?.map((data) => {
          return { name: data.name || data, page: 1, priority: 1 };
        }) || [];
    },

    searchProduct: (state, action) => {
      let { newKey, type, page, sorted } = action.payload;
      if (!newKey) {
        state.search = {};
        state.searchPro = [];
        return;
      }

      let searchKeys = state.searchKeys;
      let key = { name: newKey, type };
      if (Number(type)) {
        searchKeys = searchKeys.filter((data) => data.type !== type);
      } else {
        if (state.searchSort !== sorted) {
          state.searchSort = sorted;
        }

        if (page === null) {
          const existKey = searchKeys.find((data) => data.name === newKey);
          if (existKey) {
            key = existKey;
            searchKeys = searchKeys.filter((data) => data.name !== newKey);
          } else {
            key.cached = [{ sorted, page }];
          }
        }

        state.search = {
          keyName: newKey,
          keyPage: page,
          type,
        };
      }
      if (Number(type) || page === null) {
        searchKeys.unshift(key);
        state.searchKeys = searchKeys;
      }
    },

    searchSortChange: (state, action) => {
      const { newSort, keyName, type } = action.payload;
      const name = (data) => data.name.includes(keyName);
      const tOfP = (data) => data.tOfP == keyName;
      const searchPro = state.searchPro;
      let filtered = (searchPro.length > 0 ? searchPro : state.products).filter(
        type === "tOfP" ? tOfP : name
      );
      state.searchPro = filtered.sort((a, b) => {
        if (newSort == "Low to High") {
          return (
            a.variants[0].options[0].current - b.variants[0].options[0].current
          );
        }
        if (newSort == "High to Low") {
          return (
            b.variants[0].options[0].current - a.variants[0].options[0].current
          );
        }
        if (newSort == "New Arrivals") {
          return b.createdAt - a.createdAt;
        }
        if (newSort == "Rating") {
          return b.rating - a.rating;
        }
        if (newSort == "Discount") {
          return b.discount[0] - a.discount[0];
        }
        if (newSort == "Popular") {
          return b.popular - a.popular;
        }
      });
    },

    searchKeyChange: (state, action) => {
      const key = action.payload;
      const keyName = state.search.keyName;
      const loadedData = state.products;

      if (key !== keyName) {
        state.search = {};
        const ids = loadedData.map((data) => data._id);
        const searchPro = state.searchPro;
        const unique = [];
        searchPro.forEach((data) => {
          const { _id } = data;
          if (!ids.includes(_id)) {
            unique.push(data);
            ids.push(_id);
          }
        });
        state.products.push(...unique);
      }

      state.searchPro = key
        ? loadedData.filter((pro) => pro.name.includes(key))
        : [];
    },

    activityKey: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    addNewProduct: (state, action) => {
      const { data, key, name, page, index } = action.payload;
      const ids = state.products.map((data) => data._id);
      const unique = [];
      data.forEach((doc) => {
        const { _id } = doc;
        if (!ids.includes(_id)) {
          unique.push(doc);
          ids.push(_id);
        }
      });
      if (key == "intTofP") {
        if (index >= 0) {
          state.intTofP[index].page = page;
        } else {
          state.intTofP.push({ name, page, priority: 1 });
        }
      } else {
        index >= 0
          ? (state.categoryKeys[index].page = page)
          : state.categoryKeys.push({ name, page });
      }
      state.products.push(...unique);
    },
    addSingleProduct: (state, action) => {
      const { data, _id } = action.payload;
      if (!state.products.some((obj) => obj._id == _id))
        state.products.push(data);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRandom.pending, (state, action) => {
      state.loadingA = "random-pro";
    });

    builder.addCase(fetchRandom.fulfilled, (state, action) => {
      const { data, resPage, resIntTofP } = action.payload;
      const unique = [];
      const ids = state.products.map((data) => data._id);
      state.page = resPage || null;
      state.intTofP = resIntTofP;

      data?.forEach((data) => {
        const { _id } = data;
        if (!ids.includes(_id)) {
          unique.push(data);
          ids.push(_id);
        }
      });
      state.products.push(...unique);
      state.loadingA = false;
    });

    builder.addCase(fetchRandom.rejected, (state, action) => {});

    builder.addCase(fetchKeyProduct.pending, (state, action) => {
      state.loadingA = "key-pro";
    });

    builder.addCase(fetchKeyProduct.fulfilled, (state, action) => {
      const { data, resPage, sorted, type, keyName } = action.payload;
      const unique = [];

      if (type == "tOfP") {
        state.intTofP = state.intTofP.map((data) => {
          if (data.type === keyName) {
            data.page = resPage;
          }
          return data;
        });
      }
      let searchData = state.searchKeys;
      let createNew = searchData.find((data) => data.name === keyName);

      if (createNew) {
        searchData = searchData.filter((data) => data.name !== keyName);
        const findCached = createNew.cached.findIndex(
          (data) => data.sorted === sorted
        );
        if (findCached >= 0) {
          createNew.cached[findCached].page = resPage;
        } else {
          createNew.cached.push({ sorted, page: resPage });
        }
      } else {
        createNew = {
          name: keyName,
          type,
          cached: [{ sorted, page: resPage }],
        };
      }
      searchData.unshift(createNew);

      state.searchKeys = searchData;

      const ids = state.searchPro.map((data) => data._id);
      (state.search.keyPage = resPage),
        data?.forEach((data) => {
          const { _id } = data;
          if (!ids.includes(_id)) {
            unique.push(data);
            ids.push(_id);
          }
        });
      state.searchPro.push(...unique);
      state.loadingA = false;
    });

    builder.addCase(intTofPFunc.fulfilled, (state, action) => {
      const { newIntTofP, success, message } = action.payload;

      if (message) {
        state.aSOS = { type: "Error", message };
      }
      state.intTofP = newIntTofP;
    });

    builder.addCase(intTofPFunc.rejected, (state, action) => {});

    builder.addCase(removeSearchKeys.pending, (state, action) => {
      state.loadingA = "deleting-search";
    });
    builder.addCase(removeSearchKeys.fulfilled, (state, action) => {
      const { newSearchKeys, success, message } = action.payload;

      if (message) {
        state.aSOS = { type: "Error", message };
      } else {
        state.searchKeys = newSearchKeys;
      }
      state.loadingA = false;
    });

    builder.addCase(removeSearchKeys.rejected, (state, action) => {
      state.loadingA = false;
    });
  },
});

export const {
  commonActivity,
  searchProduct,
  searchSortChange,
  searchKeyChange,
  activityKey,
  addNewProduct,
  addSingleProduct,
} = ActivitySlice.actions;

export default ActivitySlice.reducer;
