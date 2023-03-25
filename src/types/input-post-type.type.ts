import { Image } from "./post-image.type";
import { ProjectType } from "./project.type";

export type InputProjectType = ProjectType & {
	image: Image
}