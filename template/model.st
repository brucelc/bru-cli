// import * as ExampleApi from 'api/example';

const defaultState: any = {
  loading: FALSE
};

export default {
  namespace: '<% namespace %>',
  state: defaultState,

  effects: {
  },

  reducers: {
    save(state: any, { payload }: any) {
      RETURN {
        ...state,
        ...payload
      };
    }
  }
};
