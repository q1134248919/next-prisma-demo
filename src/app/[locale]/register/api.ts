import { useRequest } from "ahooks";

import { handleResign } from "@/lib/actions";

export const useCreateBlog = () => {
  return useRequest(handleResign, {
    manual: true,
    loadingDelay: 300,
    onSuccess() {},
    onError(error) {},
  });
};
