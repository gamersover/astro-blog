export interface Post {file:string;source:string;title:string;date:string;stamp:string;slug:string;route:string;url:string;tags:string[];categories:string[];topic:string;draft:boolean;body:string;excerpt:string;minutes:number;html:string;headings:{level:number;slug:string;title:string}[];hasMermaid:boolean}
export interface Topic {id:string;name:string;mark:string;caption:string;description:string}
export const site:{title:string;author:string;description:string};
export const topics:Topic[];
export function getPosts():Post[];
export function getSeries(post:Post):Post[];
export function displayDate(date:string):string;
export function escapeHtml(value:string):string;
export function slugify(value:string):string;
