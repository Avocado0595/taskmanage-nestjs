import { ConfigModule, ConfigService } from "@nestjs/config"

export class JwtConfig{
    static getJwtConfig(configService: ConfigService){
      return {
        secret: configService.get('SECRET_ACCESSTOKEN'),
          signOptions:{
            expiresIn: 36000,
          }
      }
  }
}
  
  export const jwtConfigAsync = {
    imports:[ConfigModule],
    useFactory: async (configService: ConfigService): Promise<JwtConfig>=>JwtConfig.getJwtConfig(configService),
    inject: [ConfigService]
  }