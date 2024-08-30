// import { ApiProperty } from '@nestjs/swagger'
// import { CommonEntity } from '@slibs/database'
// import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
// import { TELEGRAM_SENDER } from '../interface'

// const Description = {
//   id: 'id',
//   sender: 'sender',

//   // telegram message info
//   messageId: 'telegram message id',
//   type: 'message type',
//   content: 'message content',
// }

// @Entity()
// @Index(['type'], { unique: false })
// export class TelegramMessage extends CommonEntity {
//   @ApiProperty({ example: 1, description: Description.id })
//   @PrimaryGeneratedColumn({ type: 'int', comment: Description.id })
//   readonly id: number

//   @ApiProperty({ example: 1, description: Description.sender })
//   @Column({
//     type: 'enum',
//     enum: TELEGRAM_SENDER,
//     comment: Description.sender,
//   })
//   sender: TELEGRAM_SENDER

//   @ApiProperty({ example: 1, description: Description.messageId })
//   @Column({
//     type: 'bigint',
//     comment: Description.messageId,
//   })
//   messageId: number

//   @ApiProperty({ example: 'text', description: Description.type })
//   @Column({
//     type: 'varchar',
//     comment: Description.type,
//   })
//   type: string

//   @ApiProperty({ example: 'Hello, world!', description: Description.content })
//   @Column({
//     type: 'text',
//     comment: Description.content,
//   })
//   content: string
// }
