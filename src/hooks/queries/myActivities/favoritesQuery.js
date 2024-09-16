import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import queryKeys from '../queryKeys';
import { getMyFavorites, removeFavorite } from '../../../api/favorites';

export const useGetMyFavoritesQuery = (userId, page) => {
  return useQuery({
    queryKey: queryKeys.boardController.favorites(userId, page),
    queryFn: (signal) => getMyFavorites(signal),
    select: ({ data, pages: totalPages }) => {
      return { data, totalPages };
    },
    placeholderData: keepPreviousData,
    suspense: true
  });
};

export const useFavoriteDeleteMutate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.boardController.favorites());
    }
  });
};

// prefetch 함수
export const useFavoritesPrefetchQuery = (userId) => {
  const queryClient = useQueryClient();

  const prefetchFavorites = async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.boardController.favorites(userId, 1),
      queryFn: getMyFavorites
    });
  };

  return prefetchFavorites;
};
