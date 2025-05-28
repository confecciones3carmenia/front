export interface EssentialLinkProps {
    title: string;
    caption?: string;
    to?: string;
    icon: string;
    subLinks?: Array<EssentiaLink>
}

interface EssentiaLink {
    title: string;
    caption?: string;
    to?: string;
    icon: string;    
}