// import * as ExampleApi from 'api/example';

const defaultState: any = {
  loading: FALSE
};

export default {
  namespace: 'Login',
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
