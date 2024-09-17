import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSearchKeys = createAsyncThunk(
  "fetchSearchKeys",
  async (key) => {
    const request = await fetch(
      `/api/product/${key}`,

      {
        cache: "no-cache",
      }
    );

    return await request.json();
  }
);

const PageHistorySlice = createSlice({
  name: "pageHistory",
  initialState: {
    loading: false,
    tOfPKeys: [],
    nameKeys: [],
    filteredSearch: [],
    searches: [],
    tOfPFetch: false,
    suggestion: "0px",
    pSOS: false,
  },

  reducers: {
    visitPage: (state, action) => {
      const { name, value, active } = action.payload;
      if (active) {
        state.active = active;
      }
      if (value) {
        const obj = state[name] || {};
        const { fetchKey, tOfPName, pending, cateName, proId } = obj;
        const { fetchKey: valueFetchKey, newId, fetchNow } = value;
        if (fetchKey && fetchKey == valueFetchKey) {
          return;
        }

        if (fetchKey && valueFetchKey && fetchKey !== valueFetchKey) {
          obj.pending = fetchKey;
        }
        state[name] = Object.assign(obj, value);
      }
    },

    singleProData: (state, action) => {
      let { fetchKey, data, pending } = action.payload;
      const category = fetchKey === "category";
      const singleP = state.singleP;

      if (category) {
        singleP.cateData.push(...data);
        ++singleP.catePage;
      } else {
        singleP.tOfPData.push(...data);
        ++singleP.tOfPPage;
      }

      singleP.pending = undefined;
      singleP.fetchKey = pending ? pending : "";

      if (singleP.fetchKey) {
        singleP.fetchNow = Math.floor(Math.random() * 1000);
      }
      state.singleP = singleP;
    },

    singleProKeyChange: (state, action) => {
      const { name, value } = action.payload;
      state.singleP[name] = value;
    },
    pageKeyChange: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },

    position: (state, action) => {
      const current = action.payload;
      const active = state.active;
      if (state.suggestion !== "0px") {
        state.suggestion = "0px";
      }
      if (active !== "other" && active !== "singleP") {
        const oldP = state[active]?.scrolled;
        if (
          oldP + 500 < current ||
          oldP > current + 500
          //  &&
          // oldP - 1000 < current
        ) {
          state[active].scrolled = current;
        }
      }
    },

    clearSearch: (state, action) => {
      state.searches = [];
      state.tOfPKeys = [];
      state.filteredSearch = [];
      state.nameKeys = [];
    },
    reFetchKey: (state, action) => {
      state.singleP.fetchKey = action.payload;
      state.singleP.fetchNow = Math.floor(Math.random() * 1000);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSearchKeys.pending, (state, action) => {});
    builder.addCase(fetchSearchKeys.fulfilled, (state, action) => {
      const { success, nameKeys, tOfPKeys, key } = action.payload;
      let filtered = [];

      if (tOfPKeys.length > 0) {
        const uniqueTOfP = [...new Set([...state.tOfPKeys.concat(tOfPKeys)])];
        state.tOfPKeys = uniqueTOfP;
        filtered = uniqueTOfP.filter((keys) => keys.includes(key));
      }
      if (nameKeys.length > 0) {
        const uniqueName = state.nameKeys;
        const ids = uniqueName.map((obj) => obj._id);
        for (let key of nameKeys) {
          const { name, _id } = key;
          if (!ids.includes(_id)) {
            uniqueName.push({ name, type: Number(_id) });
          }
        }
        state.nameKeys = uniqueName;
        filtered.push(...uniqueName.filter((obj) => obj.name.includes(key)));
      }
      state.filteredSearch = filtered.slice(0, 10);
      state.searches.push(key);
    });
    builder.addCase(fetchSearchKeys.rejected, (state, action) => {});
  },
});

export const {
  position,
  visitPage,
  pageKeyChange,
  clearSearch,
  singleProData,
  singleProKeyChange,
  reFetchKey,
} = PageHistorySlice.actions;
export default PageHistorySlice.reducer;
