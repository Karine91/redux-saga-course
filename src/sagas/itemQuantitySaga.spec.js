import { takeLatest, select, put, call } from "redux-saga/effects";
import fetch from "isomorphic-fetch";

import { handleIncreaseItemQuantity } from "./itemQuantitySaga";

import {
  DECREASE_ITEM_QUANTITY,
  INCREASE_ITEM_QUANTITY,
  setItemQuantityFetchStatus,
  FETCHED,
  FETCHING,
  decreaseItemQuantity
} from "../actions";

import { fromJS } from "immutable";
import { currentUserSelector } from "../selectors/";

describe("item quantity saga", () => {
  let item;
  let user;
  beforeEach(() => {
    item = { id: 15432 };
    user = fromJS({ id: "sldkfjks" });
  });

  describe("handle increase item quantity", () => {
    let gen;
    beforeEach(() => {
      gen = handleIncreaseItemQuantity(item);
      expect(gen.next().value).toEqual(
        put(setItemQuantityFetchStatus(FETCHING))
      );
      expect(gen.next().value).toEqual(select(currentUserSelector));
      expect(gen.next(user).value).toEqual(
        call(fetch, `http://localhost:8081/cart/add/sldkfjks/15432`)
      );
    });

    test("increasing quantity succesfully", () => {
      expect(gen.next({ status: 200 }).value).toEqual(
        put(setItemQuantityFetchStatus(FETCHED))
      );
    });

    test("increasing quantity unsuccesfully", () => {
      expect(gen.next({ status: 500 }).value).toEqual(
        put(decreaseItemQuantity(item.id, true))
      );
      expect(gen.next().value).toEqual(
        put(setItemQuantityFetchStatus(FETCHED))
      );
    });
  });
});
