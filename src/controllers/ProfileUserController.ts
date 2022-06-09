import { Request, Response } from "express";
import { ProfileUserService } from "../services/ProfileUserService";

class ProfileUserController {
  async handle(req: Request, res: Response) {
    const service = new ProfileUserService();
    const result = await service.execute(req.user_id);

    res.json(result);
  }
}
export { ProfileUserController };
