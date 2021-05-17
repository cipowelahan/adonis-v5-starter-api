declare module '@ioc:Adonis/Core/Response' {
  interface ResponseContract {
    sendData(data: any, message?: string, codeHttp?: number): void
		sendError(error: any, message?: string, codeHttp?: number): void
  }
}
