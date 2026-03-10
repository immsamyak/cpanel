import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Server Management Platform API')
        .setDescription('REST API for managing servers, domains, databases, and deployments')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    const port = process.env.APP_PORT || 3001;
    await app.listen(port);
    console.log(`🚀 API running on http://localhost:${port}`);
    console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
}
bootstrap();
