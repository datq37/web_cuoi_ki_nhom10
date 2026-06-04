export interface RatingPageProps {
    order?: any;
    onClose: () => void;
}

export interface RatingFormProps {
    dishDetails: any;
    dishImage?: string;
    dishNames: string;
    rating: number;
    setRating: (rating: number) => void;
    comment: string;
    setComment: (comment: string) => void;
    images: string[];
    handleImageFiles: (files: File[]) => void;
    handleRemoveImage: (idx: number) => void;
}
