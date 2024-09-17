import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import queryString from "query-string";
import categories from "@/app/admin/p-general/categories";

export const requiredDesc = createAsyncThunk(
  "requiredDesc",
  async (category) => {
    const request = await fetch(`/api/admin/p-general/required/`, {
      method: "POST",
      body: JSON.stringify({ category }),
      headers: { "Content-Type": "application/json" },
    });
    return await request.json();
  }
);
export const findDistricts = createAsyncThunk(
  "findDistricts",
  async (state) => {
    const req = await fetch(`/api/all/districts?state=${state}`);
    return await req.json();
  }
);

export const searchProduct = createAsyncThunk(
  "searchProduct",
  async ({ key, page }) => {
    const request = await fetch(`/api/search-product/key/`, {
      method: "POST",
      body: JSON.stringify({ key, page }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await request.json();
  }
);
export const deleteProduct = createAsyncThunk(
  "deleteProduct",
  async ({ token, _id }) => {
    const request = await fetch(
      `/api/admin/p-general/delete?token=${token}&_id=${_id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    return await request.json();
  }
);
export const pOSChange = createAsyncThunk("pOSChange", async (query) => {
  const newStatus = query.newStatus;
  const api = (
    newStatus !== "Canceled" && newStatus !== "Delivered"
      ? "update-status"
      : newStatus
  ).toLowerCase();
  const request = await fetch(`/api/admin/product-manager/${api}`, {
    method: "PUT",
    body: JSON.stringify(query),
    headers: { "Content-Type": "application/json" },
  });
  const res = await request.json();
  return { ...query, ...res };
});

const ManagerSlice = createSlice({
  name: "manager",
  initialState: {},

  reducers: {
    mainKeyChange: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    dataSelect: (state, action) => {
      let id = action.payload;
      const drafts = state.drafts;
      let mainDoc = false;

      if (id) {
        mainDoc = state.searchData.find((pro) => pro._id == id);
      }
      if (!mainDoc && drafts.length > 0) {
        mainDoc = drafts.find((draft) => draft.draftId == id) || drafts[0];
      }

      let { data, draftId, date, time, _id, varKVD, description } = mainDoc;

      if (_id) {
        const finalValue = {};
        for (let varKey in varKVD) {
          const objConverted = [];
          const values = varKVD[varKey];

          let i = 0;
          objConverted.push({ "": "" });
          while (i < values.length) {
            objConverted.push({ [values[i]]: values[i + 1] });
            i = i + 2;
          }
          finalValue[varKey] = objConverted;
        }
        mainDoc.varKVD = finalValue;
        if (description[0]) {
          mainDoc.description.unshift("");
        }
      }

      if ((id && data?._id) || id == 0) {
        mainDoc = false;
        draftId = 0;
      } else if (_id) {
        draftId = 0;
      }

      state.openedDraft = draftId;
      state.preview = "mobile";
      state.data = !mainDoc
        ? {
            name: "",
            variants: [],
            imageSetD: "Colour",
            imageSets: [],
            keyValueD: [],
            aInfo: [],
            certificate: [],
            description: [""],
            imageSetD: "Colour",
            varOpt: [],
            varKVD: {},
            thumbnail: { thumbId: "", thumbUrl: "" },
            des1: "",
            des2: "",
            des3: "",
            buyers: [],
            variantPD: false,
            imgSetPD: false,
          }
        : data
        ? data
        : mainDoc;

      state.loading = false;
      state.container = "Type";
      state.public_ids = [];
      state.searchPage = 0;
      state.searchKey = "";
      // state.indexes = {}; // yaha par sabhi component jaise ki jo variant jo color jo discount open hoga uska index de sakte
      if (id == undefined) {
        state.category = categories;
        state.requiredData = [];
        state.searchData = [];
        state.searchResult = [];
        state.selectedState = { state: "Chhattisgarh", districts: [] };
        state.fetchedDistricts = [];
      }
    },

    getDrafts: (state, action) => {
      const storageName = action.payload;
      let draft = localStorage.getItem(storageName);
      if (draft) {
        draft = JSON.parse(draft);
        if (Array.isArray(draft)) {
          draft = draft;
        } else {
          localStorage.setItem(storageName, "[]");
          draft = [];
        }
      } else {
        draft = [];
        localStorage.setItem(storageName, "[]");
      }
      state.drafts = draft;
    },

    draftSave: (state, action) => {
      try {
        const storageName = action.payload;
        const currentDoc = state.data;

        const openedDraft = state.openedDraft;

        const { name, category, brand, tOfP } = currentDoc;

        if (name.length < 5 || !category || !brand || !tOfP) {
          throw new Error("Please select product name and type");
        }

        let oldData = localStorage.getItem(storageName);
        oldData = JSON.parse(oldData);
        const today = new Date();
        const date = `${today.getDate()}/${
          today.getMonth() + 1
        }/${today.getFullYear()}`;

        const hours = today.getHours();
        const minutes = today.getMinutes();

        const time = `${hours < 10 ? "0" : ""}${hours}:${
          minutes < 10 ? "0" : ""
        }${minutes}`;

        const createData = { time, date, data: currentDoc };
        const findIndex = oldData.findIndex(
          (data) => data.draftId == openedDraft
        );
        if (findIndex >= 0) {
          createData.draftId = oldData[findIndex].draftId;
          oldData[findIndex] = createData;
        } else {
          createData.draftId = Math.floor(Math.random() * 1000);
          oldData.unshift(createData);
        }

        const stringData = JSON.stringify(oldData);
        const encoder = new TextEncoder();
        const encodedString = encoder.encode(stringData);
        const sizeInMegabytes = +(encodedString.length / (1024 * 1024)).toFixed(
          2
        );

        if (sizeInMegabytes >= 4) {
          throw new Error("Delete any draft products first");
        }

        localStorage.setItem(storageName, stringData);
        state.drafts = oldData;
        state.openedDraft = createData.draftId;
        state.loading = { type: "Success", message: "Saved In Draft" };
      } catch (err) {
        state.loading = { type: "Error", message: err.message };
      }
    },

    draftDelete: (state, action) => {
      const { storageName, id } = action.payload;
      if (state.openedDraft == id) {
        state.openedDraft = 0;
      }
      const filtered = state.drafts.filter((data) => data.draftId !== id);
      state.drafts = filtered;
      localStorage.setItem(storageName, JSON.stringify(filtered));
    },

    toggle: (state, action) => {
      const { name, value } = action.payload;
      const old = state[name];
      if (old !== value) {
        state[name] = value;
      }
    },
    changeStateKey: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },

    changeDateKey: (state, action) => {
      let { name, value, clear } = action.payload;
      if (typeof value === "string") {
        value = value.trim();
      }
      if (name == "category" && !clear) {
        state.data.tOfP = "";
        state.data.brand = "";
      }
      if (name == "tOfP") {
        state.data.keyValueD = [];
        state.data.aInfo = [];
        state.data.certificate = [];
      }

      state.data[name] = value;
    },

    filterOption: (state, action) => {
      let { key, optName } = action.payload;
      const optData = [];
      const data = state[optName];

      for (let i of data) {
        let keyCopy = i.toLowerCase();
        if (keyCopy.includes(key.toLowerCase())) {
          optData.push(i);
        }
      }

      state.optFiltered = { optName, optData };
    },

    removeUpdatedDoc: (state, action) => {
      let _id = action.payload;
      state.searchData = state.searchData.filter((doc) => doc._id !== _id);
      state.searchResult = state.searchResult.filter((doc) => doc._id !== _id);
    },
    updateStock: (state, action) => {
      let { variantIndex, optIndex, newLocated } = action.payload;

      state.data.variants[variantIndex].options[optIndex].loc = newLocated;
    },

    updatePrice: (state, action) => {
      let { key, value, optIndex, variantIndex } = action.payload;

      state.data.variants[variantIndex].options[optIndex][key] = +value;
    },

    manageDiscountOption: (state, action) => {
      let { variantIndex, newData, disOptIndex } = action.payload;
      let newOpt = state.data.variants[variantIndex].disOpt;

      if (newData) {
        let message = { count: 0, name: "" };
        newOpt.forEach((opt) => {
          if (opt.min == newData.min) {
            message.name =
              "Minimum quantity already available in discount option";
            message.count++;
          }
          if (opt.dis == newData.dis) {
            message.name = `${newData.dis}% discount is already available in discount option`;
            message.count++;
          }
        });
        if (newOpt.length > 4) {
          message.name = "Cannot create more than 5 discount options";
          message.count++;
        }
        if (
          message.name &&
          (typeof disOptIndex !== "number" ||
            (disOptIndex >= 0 && message.count == 2))
        ) {
          state.loading = {
            type: "Warning",
            message: message.name,
          };
          return;
        }

        if (disOptIndex >= 0) {
          newOpt[disOptIndex] = newData;
          state.data.variants[variantIndex].disOpt = newOpt;
        } else if (newData) {
          state.data.variants[variantIndex].disOpt.push(newData);
        }
      } else {
        newOpt = newOpt.filter((data, index) => index !== disOptIndex);
        state.data.variants[variantIndex].disOpt = newOpt;
      }
    },
    pOMKeyChange: (state, action) => {
      const { name, value } = action.payload;
      state.pOM[name] = value;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(requiredDesc.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(requiredDesc.fulfilled, (state, action) => {
      const { success, message, data } = action.payload;

      state.loading = success ? false : { type: "Error", message };

      let { brands, tOfPS } = data;
      state.brand = brands;
      state.tOfP = tOfPS;
      state.requiredData.push(data);
    });
    builder.addCase(requiredDesc.rejected, (state, action) => {
      state.loading = { type: "Error", message: action.error.message };
    });

    builder.addCase(searchProduct.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(searchProduct.fulfilled, (state, action) => {
      const { success, message, data, nextPage, total, searchKey } =
        action.payload;

      state.loading = success ? false : { type: "Error", message };

      if (total) {
        const ids = state.searchData.map((pro) => pro._id);
        const filtered = data.filter((pro) => !ids.includes(pro._id));
        state.searchData.push(...filtered);
      }
      state.searchResult = data;
      state.searchPage = nextPage;
      state.searchKey = searchKey;
      state.container = "searchProduct";
    });

    builder.addCase(searchProduct.rejected, (state, action) => {
      state.loading = { type: "Error", message: action.error.message };
    });

    builder.addCase(findDistricts.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(findDistricts.fulfilled, (state, action) => {
      state.selectedState = action.payload;
      state.fetchedDistricts.push(action.payload);
      state.loading = false;
    });

    builder.addCase(findDistricts.rejected, (state, action) => {
      state.loading = { type: "Error", message: action.error.message };
    });
    builder.addCase(deleteProduct.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      const { success, message, _id } = action.payload;
      if (_id) {
        state.searchData = state.searchData.filter((doc) => doc._id != _id);
        state.searchResult = state.searchResult.filter((doc) => doc._id != _id);
      }

      state.loading = {
        type: success ? "Success" : "Error",
        message,
        time: 5000,
      };
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = { type: "Error", message: action.error.message };
    });

    builder.addCase(pOSChange.pending, (state, action) => {
      state.pOM.loading = true;
    });
    builder.addCase(pOSChange.fulfilled, (state, action) => {
      const { success, message, orderId } = action.payload;
      state.pOM.loading = {
        type: success ? "Success" : "Error",
        message,
        time: 5000,
      };
      if (success) {
        const [docId, ItemId] = orderId.split("-");
        const allOrders = state.pOM.allOrders;
        state.pOM.allOrders = allOrders.flatMap((obj) => {
          const { _id: oId, items, ...data } = obj;
          if (oId == docId) {
            const newItems = items.filter((item) => item._id != ItemId);
            if (newItems.length)
              return {
                _id: oId,
                ...data,
                items: newItems,
              };
            else return [];
          } else return obj;
        });
      }
    });
  },
});

export const {
  dataSelect,
  draftSave,
  getDrafts,
  changeDateKey,
  filterOption,
  changeCategory,
  toggle,
  changeStateKey,
  changeTOfP,
  draftDelete,
  removeUpdatedDoc,
  updateStock,
  updatePrice,
  manageDiscountOption,
  mainKeyChange,
  pOMKeyChange,
} = ManagerSlice.actions;
export default ManagerSlice.reducer;
