import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getSavedFarms,
    getSavedListings,
    saveFarm,
    saveListing,
    unsaveFarm,
    unsaveListing
} from "../api/saved-items";
import { useGetCurrentUser } from "./useGetCurrentUser";

export function useSavedListings(skip: number = 0, limit: number = 100) {
    const { user, loading: userLoading } = useGetCurrentUser();
    return useQuery({
        queryKey: ["saved-listings", skip, limit],
        queryFn: () => getSavedListings(skip, limit),
        enabled: !!user && !userLoading
    });
}

export function useSaveListing() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveListing,
        onSuccess: () => {
            // toast({
            //     title: "Success",
            //     description: "Listing saved successfully!",
            // });
            queryClient.invalidateQueries({ queryKey: ["saved-listings"] });
        },
        onError: (error: Error) => {
            // toast({
            //     title: "Error",
            //     description: error.message || "Failed to save listing. Please try again.",
            //     variant: "destructive",
            // });
        },
    });
}

export function useUnsaveListing() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unsaveListing,
        onSuccess: () => {
            // toast({
            //     title: "Success",
            //     description: "Listing unsaved successfully!",
            // });
            queryClient.invalidateQueries({ queryKey: ["saved-listings"] });
        },
        onError: (error: Error) => {
            // toast({
            //     title: "Error",
            //     description: error.message || "Failed to unsave listing. Please try again.",
            //     variant: "destructive",
            // });
        },
    });
}

export function useSavedFarms(skip: number = 0, limit: number = 100) {
    const { user, loading: userLoading } = useGetCurrentUser();
    return useQuery({
        queryKey: ["saved-farms", skip, limit],
        queryFn: () => getSavedFarms(skip, limit),
        enabled: !!user && !userLoading
    });
}

export function useSaveFarm() {         
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveFarm,
        onSuccess: () => {
            // toast({
            //     title: "Success",
            //     description: "Farm saved successfully!",
            // });
            queryClient.invalidateQueries({ queryKey: ["saved-farms"] });
        },
        onError: (error: Error) => {
            // toast({
            //     title: "Error",
            //     description: error.message || "Failed to save farm. Please try again.",
            //     variant: "destructive",
            // });
        },
    });
}

export function useUnsaveFarm() {   
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unsaveFarm,
        onSuccess: () => {
            // toast({
            //     title: "Success",
            //     description: "Farm unsaved successfully!",
            // });
            queryClient.invalidateQueries({ queryKey: ["saved-farms"] });
        },
        onError: (error: Error) => {
            // toast({
            //     title: "Error",
            //     description: error.message || "Failed to unsave farm. Please try again.",
            //     variant: "destructive",
            // });
        },
    });
} 